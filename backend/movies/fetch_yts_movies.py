import os
import sys
import django

from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "main_config.settings"
)

django.setup()

from django.db import transaction
from movies.models import Movie, Cast, MovieImage, Torrent
from movies.yts_api import get_movie_list, get_movie_details




MAX_WORKERS = 20
PAGE_LIMIT = 50




def save_movie_details(yts_id, details):

    with transaction.atomic():

        movie, created = Movie.objects.update_or_create(
            yts_id=yts_id,
            defaults={
                "imdb_code": details.get("imdb_code") or "",
                "title": details.get("title") or "",
                "title_english": details.get("title_english"),
                "slug": details.get("slug"),
                "year": details.get("year") or 0,
                "rating": details.get("rating") or 0,
                "runtime": details.get("runtime") or 0,
                "genres": details.get("genres") or [],
                "description_full": details.get("description_full"),
                "yt_trailer_code": details.get("yt_trailer_code"),
                "language": details.get("language") or "en",
                "mpa_rating": details.get("mpa_rating"),
                "date_uploaded": details.get("date_uploaded"),
                "date_uploaded_unix": details.get("date_uploaded_unix"),
                "is_fetched": False,
            }
        )

       

        movie.cast_members.all().delete()

        cast_records = []

        for person in details.get("cast") or []:

            cast_records.append(
                Cast(
                    movie=movie,
                    name=person.get("name") or "",
                    character_name=person.get("character_name") or "",
                    url_small_image=person.get("url_small_image"),
                    imdb_code=person.get("imdb_code"),
                )
            )

        if cast_records:
            Cast.objects.bulk_create(cast_records)

       

        image_data = {
            "background_image": details.get("background_image") or "",
            "background_image_original": details.get("background_image_original") or "",
            "small_cover_image": details.get("small_cover_image") or "",
            "medium_cover_image": details.get("medium_cover_image") or "",
            "large_cover_image": details.get("large_cover_image") or "",
            "medium_screenshot_image1": details.get("medium_screenshot_image1"),
            "medium_screenshot_image2": details.get("medium_screenshot_image2"),
            "medium_screenshot_image3": details.get("medium_screenshot_image3"),
            "large_screenshot_image1": details.get("large_screenshot_image1"),
            "large_screenshot_image2": details.get("large_screenshot_image2"),
            "large_screenshot_image3": details.get("large_screenshot_image3"),
        }

        MovieImage.objects.update_or_create(
            movie=movie,
            defaults=image_data
        )


        movie.torrents.all().delete()

        torrent_records = []

        for torrent in details.get("torrents") or []:

            torrent_records.append(
                Torrent(
                    movie=movie,
                    url=torrent.get("url") or "",
                    hash=torrent.get("hash") or "",
                    quality=torrent.get("quality") or "",
                    type=torrent.get("type") or "",
                    is_repack=torrent.get("is_repack") or "0",
                    video_codec=torrent.get("video_codec") or "",
                    bit_depth=torrent.get("bit_depth"),
                    audio_channels=torrent.get("audio_channels"),
                    seeds=torrent.get("seeds") or 0,
                    peers=torrent.get("peers") or 0,
                    size=torrent.get("size") or "",
                    size_bytes=torrent.get("size_bytes") or 0,
                    date_uploaded=torrent.get("date_uploaded") or "",
                    date_uploaded_unix=torrent.get("date_uploaded_unix") or 0,
                )
            )

        if torrent_records:
            Torrent.objects.bulk_create(torrent_records)

       
        movie.is_fetched = True
        movie.save(update_fields=["is_fetched"])

    return movie




def fetch_movies(start_page=1, limit=50):

    page = start_page

    saved = 0
    skipped = 0
    failed = 0

    print("\n================================")
    print("YTS FAST FETCHING STARTED")
    print(f"Workers: {MAX_WORKERS}")
    print(f"Page limit: {limit}")
    print("================================")

    while True:

        print(f"\nFetching page: {page}")

        movies = get_movie_list(
            page=page,
            limit=limit
        )

        if movies is None:
            print("Movie list API failed. Stopping.")
            break

        if not movies:
            print("No more movies found.")
            break

 
        movie_ids = [
            item.get("id")
            for item in movies
            if item.get("id")
        ]

 
        existing_fetched_ids = set(
            Movie.objects.filter(
                yts_id__in=movie_ids,
                is_fetched=True
            ).values_list("yts_id", flat=True)
        )

    
        pending_ids = [
            movie_id
            for movie_id in movie_ids
            if movie_id not in existing_fetched_ids
        ]

        skipped += len(movie_ids) - len(pending_ids)

        print(f"Movies on page: {len(movie_ids)}")
        print(f"Already fetched: {len(existing_fetched_ids)}")
        print(f"Pending: {len(pending_ids)}")

     
        with ThreadPoolExecutor(
            max_workers=MAX_WORKERS
        ) as executor:

            future_to_id = {
                executor.submit(
                    get_movie_details,
                    movie_id
                ): movie_id
                for movie_id in pending_ids
            }

            for future in as_completed(future_to_id):

                yts_id = future_to_id[future]

                try:
                    details = future.result()

                except Exception as error:

                    failed += 1
                    print(f"Fetch error {yts_id}: {error}")
                    continue

                if not details:

                    failed += 1
                    print(f"Details not found: {yts_id}")
                    continue

                try:

                    movie = save_movie_details(
                        yts_id,
                        details
                    )

                    saved += 1

                    print(
                        f"Saved: {movie.title} | "
                        f"ID: {yts_id} | "
                        f"Total saved: {saved}"
                    )

                except Exception as error:

                    failed += 1

                    print(
                        f"Database error for {yts_id}: {error}"
                    )

        print(f"\nPage {page} completed.")

        page += 1

    print("\n========== FINAL SUMMARY ==========")
    print(f"New/updated saved: {saved}")
    print(f"Skipped: {skipped}")
    print(f"Failed: {failed}")
    print("===================================")


if __name__ == "__main__":

    fetch_movies(
        start_page=957,
        limit=PAGE_LIMIT
    )
