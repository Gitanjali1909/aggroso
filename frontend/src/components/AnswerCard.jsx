import { useTypewriter } from "../hooks/useTypewriter";

function AnswerCard({ result }) {
  const typedAnswer = useTypewriter(result?.answer, 18);

  if (!result) {
    return <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">No result to show.</p>;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">Model: {result.model || "n/a"}</span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
          Source: {result.sourceType || "n/a"}
        </span>
      </div>

      <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question</p>
        <p className="mt-1 text-sm font-medium text-slate-800 sm:text-base">{result.question}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Answer</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-[15px]">{typedAnswer}</p>
      </div>

      <h3 className="mt-6 text-base font-semibold tracking-tight text-slate-900">Code Evidence</h3>
      {Array.isArray(result.citations) && result.citations.length ? (
        <ul className="mt-3 space-y-3">
          {result.citations.map((citation, index) => (
            <li key={`${citation.filePath || "file"}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
              <p className="text-sm text-slate-700">
                <strong className="text-slate-900">{citation.filePath || "Unknown file"}</strong>
                {citation.lineStart ? (
                  <span className="text-slate-500">
                    {" "}
                    (lines {citation.lineStart}
                    {citation.lineEnd ? `-${citation.lineEnd}` : ""})
                  </span>
                ) : null}
              </p>
              {citation.snippet ? (
                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100 sm:text-sm">
                  {citation.snippet}
                </pre>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No snippet provided.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">No code snippet evidence returned.</p>
      )}
    </section>
  );
}

export default AnswerCard;
