from django.db import models

class Movie(models.Model):
    yts_id = models.IntegerField(unique=True, help_text="YTS API original movie ID")
    imdb_code = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=255)
    title_english = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, null=True)
    year = models.IntegerField()
    rating = models.FloatField(default=0.0)
    runtime = models.IntegerField(help_text="Runtime in minutes")
    genres = models.JSONField(help_text="Store as list, e.g., ['Action', 'Crime']")
    description_full = models.TextField(blank=True, null=True)
    yt_trailer_code = models.CharField(max_length=50, blank=True, null=True)
    language = models.CharField(max_length=10, default='en')
    mpa_rating = models.CharField(max_length=20, blank=True, null=True)
    date_uploaded = models.CharField(max_length=100, blank=True, null=True)
    date_uploaded_unix = models.BigIntegerField(blank=True, null=True)
    is_fetched = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Cast(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="cast_members")
    name = models.CharField(max_length=255)
    character_name = models.CharField(max_length=255)
    url_small_image = models.URLField(max_length=500, blank=True, null=True)
    imdb_code = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.name} as {self.character_name}"


class MovieImage(models.Model):
    movie = models.OneToOneField(Movie, on_delete=models.CASCADE, related_name="images")
    background_image = models.URLField(max_length=500)
    background_image_original = models.URLField(max_length=500)
    small_cover_image = models.URLField(max_length=500)
    medium_cover_image = models.URLField(max_length=500)
    large_cover_image = models.URLField(max_length=500)
    
   
    medium_screenshot_image1 = models.URLField(max_length=500, blank=True, null=True)
    medium_screenshot_image2 = models.URLField(max_length=500, blank=True, null=True)
    medium_screenshot_image3 = models.URLField(max_length=500, blank=True, null=True)
    large_screenshot_image1 = models.URLField(max_length=500, blank=True, null=True)
    large_screenshot_image2 = models.URLField(max_length=500, blank=True, null=True)
    large_screenshot_image3 = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"Images for {self.movie.title}"


class Torrent(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="torrents")
    url = models.URLField(max_length=500)
    hash = models.CharField(max_length=100)
    quality = models.CharField(max_length=20)
    type = models.CharField(max_length=20)
    is_repack = models.CharField(max_length=5, default="0")
    video_codec = models.CharField(max_length=20)
    bit_depth = models.CharField(max_length=5, blank=True, null=True)
    audio_channels = models.CharField(max_length=10, blank=True, null=True)
    seeds = models.IntegerField(default=0)
    peers = models.IntegerField(default=0)
    size = models.CharField(max_length=50)
    size_bytes = models.BigIntegerField()
    date_uploaded = models.CharField(max_length=100)
    date_uploaded_unix = models.BigIntegerField()

    def __str__(self):
        return f"{self.movie.title} - {self.quality} ({self.type})"
