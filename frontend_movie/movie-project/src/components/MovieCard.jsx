import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { getPoster, getGenres, formatRating, NO_POSTER } from "../utils/movie";

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="group relative block overflow-hidden rounded-xl bg-brand-card transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/20">
      <div className="aspect-2/3 w-full overflow-hidden">
        <img src={getPoster(movie)} alt={movie.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = NO_POSTER; }} />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-90" />
      <div className="absolute bottom-0 w-full p-4">
        <h3 className="truncate text-base font-bold text-white group-hover:text-brand-primary transition-colors">{movie.title}</h3>
        <div className="mt-1 flex items-center justify-between text-xs text-brand-muted">
          <span>{movie.year}</span>
          <div className="flex items-center gap-1 text-yellow-400"><Star size={14} fill="currentColor" /><span>{formatRating(movie.rating)}</span></div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {getGenres(movie).slice(0, 2).map((genre, i) => (
            <span key={i} className="rounded bg-brand-primary/20 px-2 py-0.5 text-[10px] font-medium text-brand-primary">{genre}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
export default MovieCard;