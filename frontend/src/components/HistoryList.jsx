function HistoryList({ items, onSelect }) {
  if (!items.length) {
    return <p className="muted">No recent questions yet.</p>;
  }

  return (
    <ul className="history-list">
      {items.map((item) => (
        <li key={item.id}>
          <button type="button" onClick={() => onSelect(item)} className="history-item">
            <strong>{item.question}</strong>
            <span>{new Date(item.createdAt).toLocaleString()}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default HistoryList;