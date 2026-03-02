function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <p>Built by Gitan</p>
        <a
          href="https://github.com/Gitanjali1909"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition hover:text-indigo-600 hover:decoration-indigo-300"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}

export default AppFooter;
