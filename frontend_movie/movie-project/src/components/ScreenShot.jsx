function ScreenShot({ images }) {
  if (!images) return null;
  const shots = [1, 2, 3].map((n) => ({ small: images[`medium_screenshot_image${n}`], large: images[`large_screenshot_image${n}`] })).filter((shot) => shot.small);
  if (shots.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-white">Screenshots</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {shots.map((shot, index) => (
          <a key={index} href={shot.large || shot.small} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-brand-border">
            <img src={shot.small} alt={`Screenshot ${index + 1}`} loading="lazy" className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </a>
        ))}
      </div>
    </section>
  );
}
export default ScreenShot;