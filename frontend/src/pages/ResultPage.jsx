import { Link, useLocation } from "react-router-dom";
import AnswerCard from "../components/AnswerCard";

function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  return (
    <div className="result-layout">
      <AnswerCard result={result} />
      <Link className="back-link" to="/">
        Ask another question
      </Link>
    </div>
  );
}

export default ResultPage;