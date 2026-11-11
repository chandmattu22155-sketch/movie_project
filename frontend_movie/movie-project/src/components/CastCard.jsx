function CastCard({ cast = [] }) {
  if (cast.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-white">Top Cast</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {cast.slice(0, 12).map((person) => (
          <div key={person.id} className="flex flex-col items-center rounded-xl border border-brand-border bg-brand-card p-4 text-center transition-colors hover:border-brand-primary/50">
            {person.url_small_image ? (
              <img src={person.url_small_image} alt={person.name} className="h-20 w-20 rounded-full object-cover ring-2 ring-brand-border" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-bg text-xl text-brand-muted ring-2 ring-brand-border">?</div>
            )}
            <p className="mt-3 truncate text-sm font-semibold text-white">{person.name}</p>
            <p className="truncate text-xs text-brand-muted">{person.character_name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export default CastCard;