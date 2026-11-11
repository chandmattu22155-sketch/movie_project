import { Link } from "react-router-dom";
import { getPoster, getGenres, getQualities, formatRuntime, formatRating, NO_POSTER, getBackground } from "../utils/movie";

function DetailCard({ movie }) {
  const genres = getGenres(movie);
  const qualities = getQualities(movie);
  const bgImage = getBackground(movie);

  return (
    <div className="relative">
      {bgImage && <div className="absolute inset-0 -z-10 h-125 w-full bg-cover bg-center opacity-20 blur-sm" style={{ backgroundImage: `url(${bgImage})` }} />}
      
      <section className="flex flex-col gap-8 md:flex-row pt-8">
        <div className="w-full max-w-70 shrink-0 self-start overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
          <img src={getPoster(movie)} alt={movie.title} className="w-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = NO_POSTER; }} />
        </div>

        <div className="flex-1">
          <Link to="/home" className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors">← Back to movies</Link>
          <h1 className="mt-3 text-4xl font-extrabold text-white">{movie.title}</h1>
          {movie.title_english && movie.title_english !== movie.title && <p className="mt-1 text-lg text-brand-muted">{movie.title_english}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-brand-muted">
            <span className="font-semibold text-brand-primary">{movie.year}</span>
            <span>·</span>
            <span>{formatRuntime(movie.runtime)}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-yellow-400">★ {formatRating(movie.rating)}</span>
            <span>·</span>
            <span className="uppercase">{movie.language}</span>
            {movie.mpa_rating && <><span>·</span><span>{movie.mpa_rating}</span></>}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {genres.map((genre) => <span key={genre} className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">{genre}</span>)}
          </div>

          {qualities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm font-medium text-brand-muted">Available in:</span>
              {qualities.map((quality) => <span key={quality} className="rounded border border-brand-border bg-brand-card px-2 py-0.5 text-xs font-bold text-brand-text">{quality}</span>)}
            </div>
          )}

          <h2 className="mt-8 text-xl font-bold text-white">Overview</h2>
          <p className="mt-2 leading-relaxed text-brand-muted">{movie.description_full || "No description available."}</p>
          
          <div className="mt-4 flex gap-6 text-sm text-brand-muted">
            {movie.imdb_code && <p>IMDb: <span className="text-brand-text">{movie.imdb_code}</span></p>}
            {movie.date_uploaded && <p>Uploaded: <span className="text-brand-text">{movie.date_uploaded}</span></p>}
          </div>

          {movie.yt_trailer_code && (
            <div className="mt-8 ">
              <h2 className="mb-3 text-xl font-bold text-white">Official Trailer</h2>
              <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-brand-border shadow-lg">
                <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${movie.yt_trailer_code}`} title="Trailer" allowFullScreen />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default DetailCard;