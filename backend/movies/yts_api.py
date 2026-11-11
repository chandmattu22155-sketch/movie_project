import requests
import time

BASE_URLS = [
    "https://movies-api.accel.li/api/v2",
]

HEADERS = {
    "User-Agent": "MoviesApp/1.0",
    "Accept": "application/json",
}

REQUEST_RETRIES = 3


def make_request(endpoint, params=None, retries=REQUEST_RETRIES):

    for base_url in BASE_URLS:

        url = f"{base_url}/{endpoint}"

        for attempt in range(retries):

            try:
                response = requests.get(
                    url,
                    params=params or {},
                    headers=HEADERS,
                    timeout=30
                )

                
                if response.status_code == 429:

                    retry_after = response.headers.get("Retry-After")

                    try:
                        wait_time = int(retry_after) if retry_after else 5
                    except (ValueError, TypeError):
                        wait_time = 5

                    if attempt < retries - 1:
                        print(
                            f"Rate limited. Waiting {wait_time} seconds..."
                        )
                        time.sleep(wait_time)
                        continue

                    break

                response.raise_for_status()

                data = response.json()

                if data.get("status") == "ok":
                    return data.get("data", {})

                print(
                    f"API error: {data.get('status_message')}"
                )
                break

            except (requests.RequestException, ValueError) as error:

                print(f"API request failed: {error}")

                if attempt < retries - 1:
                    wait_time = 2 ** attempt
                    time.sleep(wait_time)

        print(f"Endpoint failed: {base_url}")

    print("All YTS API endpoints failed.")
    return None


def get_movie_list(page=1, limit=50):

    params = {
        "page": page,
        "limit": min(limit, 50),
    }

    data = make_request("list_movies.json", params)

    if data is None:
        return None

    return data.get("movies", []) or []


def get_movie_details(movie_id):

    params = {
        "movie_id": movie_id,
        "with_images": "true",
        "with_cast": "true",
    }

    data = make_request("movie_details.json", params)

    if data is None:
        return None

    return data.get("movie")
