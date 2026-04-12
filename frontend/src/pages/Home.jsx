import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { getPrediction } from "../services/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const DISTRICTS = [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial",
    "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy",
    "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad",
    "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri",
    "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet",
    "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
    "Rangareddy", "Sangareddy", "Siddipet", "Suryapet",
    "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban",
    "Yadadri Bhuvanagiri",
];

const SOIL_TYPES = ["Loamy", "Clay", "Sandy", "Black Cotton", "Red Sandy", "Alluvial"];
const SEASONS    = ["Kharif (Rainy)", "Rabi (Winter)", "Zaid (Summer)"];

// ─── Loading steps shown during analysis ─────────────────────────────────────
const LOADING_STEPS = [
    { icon: "🌤️", text: "Fetching live weather from OpenWeatherMap..." },
    { icon: "🌾", text: "Analysing crop suitability for your soil..." },
    { icon: "⚠️", text: "Calculating risk level from live conditions..." },
    { icon: "🤖", text: "Generating AI advice via Gemini..." },
    { icon: "💾", text: "Saving your prediction to database..." },
];

// ─── SelectField Component ────────────────────────────────────────────────────

function SelectField({ label, icon, value, onChange, options, placeholder, hasError }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                {label}
            </label>
            <div className={`relative rounded-xl transition-all duration-200 ${hasError ? "ring-1 ring-red-500/50" : ""}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none select-none">
                    {icon}
                </div>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full bg-[#1a2e18]/60 border ${
                        hasError ? "border-red-500/40" : "border-[#2a4a28]/60"
                    } text-white rounded-xl pl-11 pr-10 py-3.5 text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#4ade80]/60 focus:bg-[#1a2e18] transition-all duration-200 hover:border-[#4ade80]/40`}
                    style={{ fontFamily: "'Sora', sans-serif" }}
                >
                    <option value="" disabled className="bg-[#0f1a0e] text-white/50">
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0f1a0e] text-white">
                            {opt}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

// ─── Animated Loading State ───────────────────────────────────────────────────

function LoadingState({ step }) {
    return (
        <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-[#2a4a28] border-t-[#4ade80] rounded-full animate-spin mx-auto mb-8" />
            <p className="text-white/30 text-xs mb-6">This may take up to 30 seconds — AI is generating real advice…</p>
            <div className="space-y-3 max-w-sm mx-auto">
                {LOADING_STEPS.map((s, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-500 ${
                            i === step
                                ? "bg-[#4ade80]/10 border border-[#4ade80]/20 text-white"
                                : i < step
                                ? "text-white/20 line-through"
                                : "text-white/20"
                        }`}
                    >
                        <span className="text-base flex-shrink-0">{s.icon}</span>
                        <span className="text-sm text-left">{s.text}</span>
                        {i < step && (
                            <svg className="ml-auto flex-shrink-0 text-[#4ade80]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                        {i === step && (
                            <div className="ml-auto w-3 h-3 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
    const [form, setForm]         = useState({ district: "", soil: "", season: "", land: "" });
    const [result, setResult]     = useState(null);
    const [loading, setLoading]   = useState(false);
    const [loadStep, setLoadStep] = useState(0);
    const [errors, setErrors]     = useState({});
    const [apiError, setApiError] = useState("");

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
        if (apiError) setApiError("");
    };

    const validate = () => {
        const e = {
            district: !form.district,
            soil:     !form.soil,
            season:   !form.season,
            land:     !form.land || isNaN(form.land) || parseFloat(form.land) <= 0,
        };
        setErrors(e);
        return !Object.values(e).some(Boolean);
    };

    // ✅ Longer step intervals to match real 30-60s AI generation time
    const runLoadingSteps = () => {
        setLoadStep(0);
        const intervals = [2000, 5000, 8000, 12000];
        intervals.forEach((delay, i) => {
            setTimeout(() => setLoadStep(i + 1), delay);
        });
    };

    const handleAnalyze = async () => {
        if (!validate()) return;

        setLoading(true);
        setResult(null);
        setApiError("");
        runLoadingSteps();

        try {
            const response = await getPrediction({
                district: form.district,
                soil:     form.soil,
                season:   form.season,
                land:     parseFloat(form.land),
            });

            const data = response.data.data;
            setResult(data);

            setTimeout(
                () => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
                200
            );

        } catch (error) {
            setApiError(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const hasErrors = Object.values(errors).some(Boolean);

    return (
        <div className="min-h-screen bg-[#080f07]" style={{ fontFamily: "'Sora', sans-serif" }}>

            {/* ── Hero ── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080f07] via-[#0a1609] to-[#080f07]" />
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage:
                                "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4ade80]/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#22c55e]/6 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 py-32 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80] text-xs font-semibold tracking-wider mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse flex-shrink-0" />
                        LIVE AI-POWERED AGRICULTURE ADVISORY
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                        Smarter Farming
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#22c55e] to-[#86efac]">
                            Starts Here
                        </span>
                    </h1>

                    <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                        Enter your land details and receive <strong className="text-white/80">live weather data</strong>,
                        AI-generated crop recommendations, and <strong className="text-white/80">real-time advice</strong> — tailored for Telangana.
                    </p>

                    {/* ✅ Updated badge: Claude → Gemini AI */}
                    <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
                        {[
                            { icon: "🌤️", label: "Live OpenWeatherMap data" },
                            { icon: "🤖", label: "Gemini AI advice" },
                            { icon: "💾", label: "MongoDB storage" },
                        ].map((badge) => (
                            <span key={badge.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/50 text-xs">
                                <span>{badge.icon}</span>
                                {badge.label}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={() =>
                            document.getElementById("input-section")?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-semibold rounded-2xl text-base hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                        Start Live Analysis
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="mt-20 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
                        {[
                            { val: "33",     label: "Telangana Districts" },
                            { val: "Live",   label: "Weather Data" },
                            { val: "Gemini", label: "AI Advisor" },  
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">{s.val}</div>
                                <div className="text-white/30 text-xs uppercase tracking-widest">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs">
                    <span>Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
            </section>

            {/* ── Input Section ── */}
            <section id="input-section" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-[#4ade80] text-sm font-semibold tracking-widest uppercase mb-3">
                            Field Analysis
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Enter Your Farm Details
                        </h2>
                        <p className="text-white/40 mt-3 text-base">
                            Live weather is fetched for your district · Gemini AI generates unique advice each time
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#111e10] to-[#0c160b] border border-[#2a4a28]/50 rounded-3xl p-6 md:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <SelectField
                                label="District"
                                icon="📍"
                                value={form.district}
                                onChange={(v) => updateForm("district", v)}
                                options={DISTRICTS}
                                placeholder="Select Telangana District"
                                hasError={errors.district}
                            />
                            <SelectField
                                label="Soil Type"
                                icon="🪨"
                                value={form.soil}
                                onChange={(v) => updateForm("soil", v)}
                                options={SOIL_TYPES}
                                placeholder="Select Soil Type"
                                hasError={errors.soil}
                            />
                            <SelectField
                                label="Season"
                                icon="🌤️"
                                value={form.season}
                                onChange={(v) => updateForm("season", v)}
                                options={SEASONS}
                                placeholder="Select Cropping Season"
                                hasError={errors.season}
                            />
                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                                    Land Area
                                </label>
                                <div className={`relative rounded-xl ${errors.land ? "ring-1 ring-red-500/50" : ""}`}>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none select-none">
                                        📐
                                    </div>
                                    <input
                                        type="number"
                                        value={form.land}
                                        onChange={(e) => updateForm("land", e.target.value)}
                                        placeholder="Enter acres (e.g. 5)"
                                        min="0.1"
                                        step="0.5"
                                        className={`w-full bg-[#1a2e18]/60 border ${
                                            errors.land ? "border-red-500/40" : "border-[#2a4a28]/60"
                                        } text-white rounded-xl pl-11 pr-16 py-3.5 text-sm focus:outline-none focus:border-[#4ade80]/60 focus:bg-[#1a2e18] transition-all duration-200 placeholder-white/20 hover:border-[#4ade80]/40`}
                                        style={{ fontFamily: "'Sora', sans-serif" }}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none">
                                        acres
                                    </span>
                                </div>
                            </div>
                        </div>

                        {hasErrors && (
                            <p className="text-red-400 text-xs mb-5 flex items-center gap-1.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                Please fill in all fields before analysing.
                            </p>
                        )}

                        {apiError && (
                            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-400 text-sm flex items-start gap-2">
                                    <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {apiError}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full py-4 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Fetching live data &amp; generating advice...
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                                    </svg>
                                    Analyse &amp; Get Live Recommendations
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Results ── */}
            {(result || loading) && (
                <section id="results" className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        {loading ? (
                            <LoadingState step={loadStep} />
                        ) : (
                            <ResultCard result={result} />
                        )}
                    </div>
                </section>
            )}

            {/* ── How It Works ── */}
            <section className="py-24 px-6 border-t border-[#1a2e18]/60">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-[#4ade80] text-sm font-semibold tracking-widest uppercase mb-3">
                        How It Works
                    </p>
                    <h2 className="text-3xl font-bold text-white mb-14">
                        Real Data. Real AI. Real Advice.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-left">
                        {[
                            { step: "01", icon: "📝", title: "Input Farm Details",    desc: "Select district, soil, season and land size." },
                            { step: "02", icon: "🌤️", title: "Live Weather Fetched",  desc: "OpenWeatherMap API returns actual temperature, humidity, and rainfall for your district right now." },
                            { step: "03", icon: "🤖", title: "Gemini AI Analyses",    desc: "Gemini receives your live data and generates a unique, context-aware farming advisory — not a template." },
                            { step: "04", icon: "💾", title: "Saved to MongoDB",      desc: "Every prediction is stored in your database so you can track history on the Dashboard." },
                        ].map((item) => (
                            <div key={item.step} className="relative bg-[#111e10]/60 border border-[#2a4a28]/40 rounded-2xl p-6 hover:border-[#4ade80]/30 transition-all duration-300 group overflow-hidden">
                                <div className="absolute top-4 right-4 text-4xl font-bold text-[#4ade80]/6 group-hover:text-[#4ade80]/10 transition-all select-none">
                                    {item.step}
                                </div>
                                <div className="text-3xl mb-4">{item.icon}</div>
                                <h3 className="text-white font-bold mb-2 text-sm">{item.title}</h3>
                                <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}