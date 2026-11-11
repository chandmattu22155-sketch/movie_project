function Pagination({ page, count, pageSize = 20, onChange }) {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 py-10">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-lg border border-brand-border bg-brand-card px-5 py-2 text-sm font-medium hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-brand-card disabled:hover:text-brand-text">Previous</button>
      <span className="text-sm font-medium text-brand-muted">Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="rounded-lg border border-brand-border bg-brand-card px-5 py-2 text-sm font-medium hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-brand-card disabled:hover:text-brand-text">Next</button>
    </div>
  );
}
export default Pagination;