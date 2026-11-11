from django.db.models import Q

from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from .models import Movie
from .serializers import MovieSerializer


class MoviePagination(PageNumberPagination):

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class MovieListView(generics.ListAPIView):

    serializer_class = MovieSerializer
    pagination_class = MoviePagination

    def get_queryset(self):

        queryset = Movie.objects.all()

    
        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(title_english__icontains=search) |
                Q(imdb_code__icontains=search)
            )

       
        quality = self.request.query_params.get("quality")

        if quality:
            queryset = queryset.filter(
                torrents__quality__iexact=quality
            )

       
        year = self.request.query_params.get("year")

        if year:
            queryset = queryset.filter(year=year)

        
        rating = self.request.query_params.get("rating")

        if rating:
            queryset = queryset.filter(
                rating__gte=rating
            )

        genre = self.request.query_params.get("genre")

        if genre:
            queryset = queryset.filter(
                genres__contains=[genre]
            )

     
        language = self.request.query_params.get("language")

        if language:
            queryset = queryset.filter(
                language__iexact=language
            )

        ordering = self.request.query_params.get(
            "ordering", "-date_uploaded_unix"
        )

        allowed_ordering = [
            "title",
            "-title",
            "year",
            "-year",
            "rating",
            "-rating",
            "runtime",
            "-runtime",
            "date_uploaded_unix",
            "-date_uploaded_unix",
        ]

        if ordering in allowed_ordering:
            queryset = queryset.order_by(ordering)

        return queryset.distinct().select_related(
            "images"
        ).prefetch_related(
            "cast_members",
            "torrents"
        )

class MovieDetailView(generics.RetrieveAPIView):

    serializer_class = MovieSerializer
    lookup_field = "pk"

    queryset = Movie.objects.all().select_related(
        "images"
    ).prefetch_related(
        "cast_members",
        "torrents"
    )