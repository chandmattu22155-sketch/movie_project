import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FilterSection from "../components/FilterSection";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { fetchMovies } from "../services/movieApi";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";
  const quality = searchParams.get("quality") || "";
  const rating = searchParams.get("rating") || "";
  const ordering = searchParams.get("ordering") || "-date_uploaded_unix";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movies", { page, search, genre, quality, rating, ordering }],
    queryFn: fetchMovies,
    keepPreviousData: true,
  });

  const changeParam = (name, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(name, value); else params.delete(name);
    if (name !== "page") params.delete("page");
    setSearchParams(params);
    if (name === "page") window.scrollTo(0, 0);
  };

  const filterValues = { genre, quality, rating, ordering };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 md:px-8">
        <FilterSection values={filterValues} onChange={changeParam} onClear={() => setSearchParams({})} />
        {isLoading ? (
          <div className="py-20 text-center text-brand-muted text-lg animate-pulse">Loading Movies...</div>
        ) : isError ? (
          <div className="py-20 text-center text-red-400">{error.message}</div>
        ) : data?.movies?.length === 0 ? (
          <div className="py-20 text-center text-brand-muted text-lg">No movies found.</div>
        ) : (
          <>
            <p className="mb-4 text-sm text-brand-muted">{data?.totalCount} movies found</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
              {data?.movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          </>
        )}
        <Pagination page={page} count={data?.totalCount || 0} onChange={(newPage) => changeParam("page", String(newPage))} />
      </main>
      <Footer />
    </div>
  );
}
export default HomePage;