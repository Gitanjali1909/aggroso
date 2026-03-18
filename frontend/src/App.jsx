import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatusPage from "./pages/StatusPage";
import ResultPage from "./pages/ResultPage";
import AppHeader from "./components/AppHeader";

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-100/40 to-transparent" />
      <AppHeader />

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </main>

      <AppFooter />
    </div>
  );
}

export default App;
