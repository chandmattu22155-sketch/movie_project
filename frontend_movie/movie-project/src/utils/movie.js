export const NO_POSTER = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="#27272a"/><text x="50%" y="50%" fill="#a1a1aa" font-size="20" text-anchor="middle" font-family="Arial">No Poster</text></svg>');

export function getPoster(movie) {
  return movie?.images?.large_cover_image || movie?.images?.medium_cover_image || movie?.images?.small_cover_image || NO_POSTER;
}

export function getBackground(movie) {
  return movie?.images?.background_image_original || movie?.images?.background_image || "";
}

export function getGenres(movie) {
  return Array.isArray(movie?.genres) ? movie.genres : [];
}

export function getQualities(movie) {
  const list = (movie?.torrents || []).map((t) => t.quality).filter(Boolean);
  return [...new Set(list)].sort();
}

export function formatRuntime(minutes) {
  const total = Number(minutes);
  if (!total) return "N/A";
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (!hours) return `${mins}m`;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatRating(rating) {
  const value = Number(rating);
  return Number.isFinite(value) ? value.toFixed(1) : "N/A";
}

export function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}