import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DetailCard from "../components/DetailCard";
import CastCard from "../components/CastCard";
import ScreenShot from "../components/ScreenShot";
import SimilarMovies from "../components/SimilarMovies";
import { fetchMovieById } from "../services/movieApi";

function DetailPage() {
  const { id } = useParams();
  const { data: movie, isLoading, isError, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieById(id),
  });

  if (isLoading) return <div className="min-h-screen"><Navbar /><p className="py-20 text-center text-brand-muted animate-pulse">Loading Movie Details...</p></div>;
  if (isError) return <div className="min-h-screen"><Navbar /><p className="py-20 text-center text-red-400">{error.message}</p></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="mx-auto flex-1 w-full max-w-6xl px-4 py-8">
        <DetailCard movie={movie} />
        <CastCard cast={movie.cast_members} />
        <ScreenShot images={movie.images} />
        <SimilarMovies genre={movie.genres?.[0]} currentId={movie.id} />
      </main>
      <Footer />
    </div>
  );
}
export default DetailPage;