import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatusPage from "./pages/StatusPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Codebase Q&A</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/status">Status</Link>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;