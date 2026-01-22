import { Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Results from "./pages/Results";
import Toolkit from "./pages/Toolkit";
import AiChat from "./pages/AiChat";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-16">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/results" element={<Results />} />
        <Route path="/apteczka" element={<Toolkit />} />
        <Route path="/pytania" element={<AiChat />} />
        <Route path="/kontakt" element={<Contact />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
