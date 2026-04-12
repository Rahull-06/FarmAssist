import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

// Simple About page inline
function About() {
  return (
    <div className="min-h-screen bg-[#080f07] pt-28 pb-20 px-6" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-[#4ade80] text-sm font-semibold tracking-widest uppercase mb-3">About</p>
        <h1 className="text-4xl font-bold text-white mb-6">FarmAssist</h1>
        <p className="text-white/50 text-lg leading-relaxed mb-8">
          FarmAssist is a smart agriculture advisory platform designed specifically for farmers in Telangana, India. 
          We combine agronomic data, real-time weather intelligence, and AI-based rule systems to provide 
          personalised crop recommendations for every district, soil type, and season.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: "🌾", title: "Crop Intelligence", desc: "Multi-crop recommendations with yield estimates and confidence scores based on local agronomic data." },
            { icon: "🌤️", title: "Weather Integration", desc: "District-level weather data including temperature, humidity, and rainfall for accurate advisories." },
            { icon: "🧠", title: "AI Advisory", desc: "Contextual farming advice tailored to your specific land size, soil type, and seasonal conditions." },
            { icon: "📊", title: "Prediction History", desc: "Track all your previous analyses in a clean dashboard to monitor and compare crop strategies." },
          ].map((item) => (
            <div key={item.title} className="bg-[#111e10]/60 border border-[#2a4a28]/40 rounded-2xl p-6 hover:border-[#4ade80]/30 transition-all duration-300">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#1a2e18]/40 border border-[#2a4a28]/40 rounded-2xl p-7">
          <h3 className="text-white font-bold mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Weather API", "REST API"].map((t) => (
              <span key={t} className="px-3 py-1.5 bg-[#4ade80]/8 border border-[#4ade80]/20 text-[#4ade80] text-xs rounded-lg font-semibold">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}