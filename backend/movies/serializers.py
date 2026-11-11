from rest_framework import serializers
from .models import Movie, Cast, MovieImage, Torrent


class CastSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cast
        fields = "__all__"


class MovieImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = MovieImage
        fields = "__all__"


class TorrentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Torrent
        fields = "__all__"


class MovieSerializer(serializers.ModelSerializer):

    cast_members = CastSerializer(many=True, read_only=True)
    images = MovieImageSerializer(read_only=True)
    torrents = TorrentSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            "id",
            "yts_id",
            "imdb_code",
            "title",
            "title_english",
            "slug",
            "year",
            "rating",
            "runtime",
            "genres",
            "description_full",
            "yt_trailer_code",
            "language",
            "mpa_rating",
            "date_uploaded",
            "date_uploaded_unix",
            "is_fetched",
            "cast_members",
            "images",
            "torrents",
        ]
