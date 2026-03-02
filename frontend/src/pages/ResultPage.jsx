import { Link, useLocation } from "react-router-dom";
import AnswerCard from "../components/AnswerCard";

function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  return (
    <div className="space-y-4">
      <AnswerCard result={result} />
      <Link
        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
        to="/"
      >
        Ask another question
      </Link>
    </div>
  );
}

export default ResultPage;
