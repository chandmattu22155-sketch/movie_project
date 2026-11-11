
from django.contrib import admin
from .models import Movie, Cast, MovieImage, Torrent


class CastInline(admin.TabularInline):
    model = Cast
    extra = 1


class MovieImageInline(admin.StackedInline):
    model = MovieImage
    extra = 0
    max_num = 1


class TorrentInline(admin.TabularInline):
    model = Torrent
    extra = 1


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "year",
        "rating",
        "runtime",
        "language",
        "yts_id",
    )

    search_fields = (
        "title",
        "title_english",
        "imdb_code",
    )

    list_filter = (
        "year",
        "language",
        "rating",
    )

    ordering = ("-year",)

    inlines = [
        CastInline,
        MovieImageInline,
        TorrentInline,
    ]


@admin.register(Cast)
class CastAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "character_name",
        "movie",
    )

    search_fields = (
        "name",
        "character_name",
        "movie__title",
    )


@admin.register(MovieImage)
class MovieImageAdmin(admin.ModelAdmin):
    list_display = ("movie",)


@admin.register(Torrent)
class TorrentAdmin(admin.ModelAdmin):
    list_display = (
        "movie",
        "quality",
        "type",
        "seeds",
        "peers",
        "size",
    )

    list_filter = (
        "quality",
        "type",
        "video_codec",
    )

    search_fields = (
        "movie__title",
        "hash",
    )
