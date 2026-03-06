function SkeletonLoader({ lines = 4 }) {
  return (
    <section className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-4 h-4 w-32 rounded bg-slate-200" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-3 rounded bg-slate-200 ${
              index === lines - 1 ? "w-3/4" : "w-full"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default SkeletonLoader;

