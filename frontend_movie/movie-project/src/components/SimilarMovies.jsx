import { useQuery } from "@tanstack/react-query";
import MovieCard from "./MovieCard";
import { fetchMovies } from "../services/movieApi";

function SimilarMovies({ genre, currentId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["movies", { page: 1, genre, ordering: "-rating" }],
    queryFn: fetchMovies,
    enabled: !!genre,
  });

  if (isLoading || !data?.movies) return null;
  const similar = data.movies.filter((m) => m.id !== currentId).slice(0, 5);
  if (similar.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-white">Similar Movies</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {similar.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  );
}
export default SimilarMovies;