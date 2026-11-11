const genres = ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"];
const qualities = ["480p", "720p", "1080p", "2160p", "3D"];
const ratings = ["9", "8", "7", "6", "5"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => String(currentYear - i));
const sortOptions = [["-date_uploaded_unix", "Recently added"], ["date_uploaded_unix", "Oldest added"], ["-rating", "Highest rating"], ["rating", "Lowest rating"], ["-year", "Newest year"], ["year", "Oldest year"], ["title", "Title A-Z"], ["-title", "Title Z-A"]];

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-brand-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2 text-sm text-white outline-none focus:border-brand-primary transition-colors">
        {options.map(([optionValue, optionLabel]) => (<option key={optionValue} value={optionValue}>{optionLabel}</option>))}
      </select>
    </label>
  );
}

function FilterSection({ values, onChange, onClear }) {
  return (
    <section className="mb-8 rounded-xl border border-brand-border bg-brand-card p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Select label="Genre" value={values.genre} onChange={(v) => onChange("genre", v)} options={[["", "All"], ...genres.map((g) => [g, g])]} />
        <Select label="Quality" value={values.quality} onChange={(v) => onChange("quality", v)} options={[["", "All"], ...qualities.map((q) => [q, q])]} />
        <Select label="Min Rating" value={values.rating} onChange={(v) => onChange("rating", v)} options={[["", "All"], ...ratings.map((r) => [r, `${r}+`])]} />
        <Select label="Year" value={values.year} onChange={(v) => onChange("year", v)} options={[["", "All"], ...years.map((y) => [y, y])]} />
        <Select label="Sort by" value={values.ordering} onChange={(v) => onChange("ordering", v)} options={sortOptions} />
      </div>
      <button onClick={onClear} className="mt-4 text-xs font-semibold text-brand-primary hover:text-brand-hover transition-colors">Clear filters</button>
    </section>
  );
}
export default FilterSection;