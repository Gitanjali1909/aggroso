function HistoryList({ items, onSelect }) {
  if (!items.length) {
    return <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">No recent questions yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
          >
            <span className="block truncate text-sm font-semibold text-slate-800">{item.question}</span>
            <span className="mt-1 block text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default HistoryList;
