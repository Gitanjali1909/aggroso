function AnswerCard({ result }) {
  if (!result) {
    return <p className="muted">No result to show.</p>;
  }

  return (
    <section className="card answer-card">
      <h2>Answer</h2>
      <p className="question"><strong>Question:</strong> {result.question}</p>
      <p className="answer-text">{result.answer}</p>

      <div className="meta-row">
        <span>Model: {result.model || "n/a"}</span>
        <span>Source: {result.sourceType || "n/a"}</span>
      </div>

      <h3>Code Evidence</h3>
      {Array.isArray(result.citations) && result.citations.length ? (
        <ul className="citations">
          {result.citations.map((citation, index) => (
            <li key={`${citation.filePath || "file"}-${index}`} className="citation-item">
              <p>
                <strong>{citation.filePath || "Unknown file"}</strong>
                {citation.lineStart ? (
                  <span>
                    {" "}
                    (lines {citation.lineStart}
                    {citation.lineEnd ? `-${citation.lineEnd}` : ""})
                  </span>
                ) : null}
              </p>
              {citation.snippet ? <pre>{citation.snippet}</pre> : <p className="muted">No snippet provided.</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No code snippet evidence returned.</p>
      )}
    </section>
  );
}

export default AnswerCard;