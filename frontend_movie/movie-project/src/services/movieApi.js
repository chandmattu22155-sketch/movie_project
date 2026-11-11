import { apiFetch } from "./apiClient";

export const fetchMovies = async ({ queryKey }) => {
  const [_key, { page, search, genre, quality, rating, ordering }] = queryKey;
  
  const params = new URLSearchParams();
  params.append("page", page);
  if (search) params.append("search", search);
  if (genre) params.append("genre", genre);
  if (quality) params.append("quality", quality);
  if (rating) params.append("rating", rating);
  if (ordering) params.append("ordering", ordering);

  const data = await apiFetch(`/movies/?${params.toString()}`);
  return { movies: data.results || [], totalCount: data.count || 0 };
};

export const fetchMovieById = (id) => apiFetch(`/movies/${id}/`);