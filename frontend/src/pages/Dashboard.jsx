import { useState, useEffect } from "react";
import { getHistory, deletePrediction } from "../services/api";

// ─── Config ───────────────────────────────────────────────────────────────────

const RISK_CONFIG = {
    Low:    { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
    Medium: { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30",   dot: "bg-amber-400"   },
    High:   { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/30",     dot: "bg-red-400"     },
};

const SEASON_EMOJI = {
    "Kharif (Rainy)": "🌧️",
    "Rabi (Winter)":  "❄️",
    "Zaid (Summer)":  "☀️",
};

const SEASONS = ["All", "Kharif (Rainy)", "Rabi (Winter)", "Zaid (Summer)"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const [predictions, setPredictions] = useState([]);
    const [filter,      setFilter     ] = useState("All");
    const [view,        setView       ] = useState("grid");
    const [loading,     setLoading    ] = useState(true);
    const [error,       setError      ] = useState("");
    const [deleting,    setDeleting   ] = useState(null);

    // ── Fetch from MongoDB on mount ───────────────────────────────────────────
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getHistory({ limit: 50 });
            setPredictions(response.data.data || []);
        } catch (err) {
            setError("Failed to load history. Is the backend running?");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this prediction?")) return;
        try {
            setDeleting(id);
            await deletePrediction(id);
            setPredictions((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            alert("Delete failed: " + err.message);
        } finally {
            setDeleting(null);
        }
    };

    // ── Filter logic ──────────────────────────────────────────────────────────
    const filtered = filter === "All"
        ? predictions
        : predictions.filter((p) => p.season === filter);

    // ── Stats from REAL MongoDB data ──────────────────────────────────────────
    const stats = {
        total:      predictions.length,
        low:        predictions.filter((p) => p.riskLevel === "Low").length,
        avgConf:    predictions.length
            ? Math.round(predictions.reduce((a, b) => a + (b.confidence ?? 0), 0) / predictions.length)
            : 0,
        totalAcres: predictions.reduce((a, b) => a + (b.land ?? 0), 0),
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#080f07] pt-24 pb-20" style={{ fontFamily: "'Sora', sans-serif" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* ── Header ── */}
                <div className="mb-10">
                    <p className="text-[#4ade80] text-sm font-semibold tracking-widest uppercase mb-2">
                        Farm Dashboard
                    </p>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Previous Predictions</h1>
                            <p className="text-white/40 mt-1 text-sm">
                                All data stored in MongoDB · Showing {filtered.length} of {predictions.length} records
                            </p>
                        </div>
                        <div className="flex items-center gap-2 self-start md:self-auto">
                            {/* Refresh button */}
                            <button
                                onClick={fetchHistory}
                                className="flex items-center gap-2 px-4 py-2 bg-[#111e10] border border-[#2a4a28]/50 rounded-xl text-white/50 hover:text-white text-xs font-semibold transition-colors"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>
                                Refresh
                            </button>

                            {/* View toggle */}
                            <div className="flex items-center gap-1 bg-[#111e10] border border-[#2a4a28]/50 rounded-xl p-1">
                                {["grid", "list"].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setView(v)}
                                        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                                            view === v ? "bg-[#22c55e] text-white" : "text-white/40 hover:text-white"
                                        }`}
                                        aria-label={`${v} view`}
                                    >
                                        {v === "grid" ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <rect x="3" y="3" width="8" height="8" rx="1" />
                                                <rect x="13" y="3" width="8" height="8" rx="1" />
                                                <rect x="3" y="13" width="8" height="8" rx="1" />
                                                <rect x="13" y="13" width="8" height="8" rx="1" />
                                            </svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="3" y1="6" x2="21" y2="6" />
                                                <line x1="3" y1="12" x2="21" y2="12" />
                                                <line x1="3" y1="18" x2="21" y2="18" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats (from real MongoDB data) ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total Analyses",  val: stats.total,          icon: "📋", color: "text-white" },
                        { label: "Low Risk Fields", val: stats.low,            icon: "✅", color: "text-emerald-400" },
                        { label: "Avg. Confidence", val: `${stats.avgConf}%`,  icon: "🎯", color: "text-blue-400" },
                        { label: "Total Acres",     val: stats.totalAcres,     icon: "📐", color: "text-amber-400" },
                    ].map((s, i) => (
                        <div key={i} className="bg-[#111e10]/80 border border-[#2a4a28]/40 rounded-2xl p-5">
                            <div className="text-xl mb-2">{s.icon}</div>
                            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                            <div className="text-white/30 text-xs mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Filters ── */}
                <div className="flex items-center gap-2 mb-8 flex-wrap">
                    <span className="text-white/30 text-xs uppercase tracking-wider mr-1 flex-shrink-0">Filter:</span>
                    {SEASONS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                filter === s
                                    ? "bg-[#22c55e] text-white"
                                    : "bg-[#111e10] border border-[#2a4a28]/40 text-white/50 hover:text-white hover:border-[#4ade80]/30"
                            }`}
                        >
                            {s !== "All" && <span className="mr-1.5">{SEASON_EMOJI[s]}</span>}
                            {s}
                        </button>
                    ))}
                    <span className="ml-auto text-white/20 text-xs flex-shrink-0">
                        {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* ── States ── */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-[#2a4a28] border-t-[#4ade80] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/30 text-sm">Loading from MongoDB...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">⚠️</div>
                        <p className="text-red-400 text-base mb-2">{error}</p>
                        <p className="text-white/30 text-sm mb-6">Make sure your backend is running on port 5000</p>
                        <button onClick={fetchHistory} className="px-6 py-3 bg-[#22c55e] text-white text-sm font-semibold rounded-xl hover:bg-[#16a34a] transition-colors">
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🌱</div>
                        <p className="text-white/30 text-lg">
                            {predictions.length === 0
                                ? "No predictions yet. Run your first analysis on the Home page!"
                                : "No predictions match this filter."}
                        </p>
                    </div>
                )}

                {/* ── Cards ── */}
                {!loading && !error && filtered.length > 0 && (
                    <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" : "space-y-3"}>
                        {filtered.map((pred, i) => {
                            const risk = RISK_CONFIG[pred.riskLevel] ?? RISK_CONFIG.Medium;

                            return (
                                <div
                                    key={pred._id}
                                    className="bg-gradient-to-br from-[#111e10] to-[#0c160b] border border-[#2a4a28]/50 rounded-2xl overflow-hidden hover:border-[#4ade80]/30 hover:shadow-[0_4px_30px_rgba(74,222,128,0.06)] transition-all duration-300 opacity-100"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    {view === "grid" ? (
                                        <div className="p-6">
                                            {/* Header */}
                                            <div className="flex items-start justify-between gap-3 mb-5">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="flex-shrink-0">📍</span>
                                                        <span className="text-white font-bold text-base truncate">{pred.district}</span>
                                                    </div>
                                                    <div className="text-white/30 text-xs">
                                                        {SEASON_EMOJI[pred.season]} {pred.season} · {pred.land} acres
                                                    </div>
                                                </div>
                                                <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold ${risk.bg} ${risk.text} ${risk.border} border`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${risk.dot} flex-shrink-0`} />
                                                    {pred.riskLevel}
                                                </div>
                                            </div>

                                            {/* Live weather badge */}
                                            <div className="flex items-center gap-3 mb-4 p-3 bg-white/3 rounded-xl border border-white/5">
                                                <span className="text-sm">🌡️</span>
                                                <span className="text-white/60 text-xs">{pred.weather?.temperature}°C · {pred.weather?.humidity}% humidity · {pred.weather?.condition}</span>
                                            </div>

                                            {/* Crops */}
                                            <div className="mb-5">
                                                <div className="text-white/30 text-xs uppercase tracking-wider mb-2">Recommended Crops</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {(pred.crops ?? []).map((crop, ci) => (
                                                        <span key={ci} className="text-xs px-2.5 py-1 bg-[#4ade80]/8 border border-[#4ade80]/15 text-[#4ade80] rounded-lg">
                                                            {crop.name?.split("(")[0].trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t border-[#2a4a28]/30">
                                                <span className="text-xs px-2.5 py-1 bg-[#92400e]/20 border border-[#92400e]/30 text-amber-500/70 rounded-lg">
                                                    🪨 {pred.soil}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-white/20 text-xs">
                                                        {pred.createdAt
                                                            ? new Date(pred.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })
                                                            : ""}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDelete(pred._id)}
                                                        disabled={deleting === pred._id}
                                                        className="text-white/20 hover:text-red-400 transition-colors"
                                                        title="Delete prediction"
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* List row */
                                        <div className="flex items-center gap-4 p-5">
                                            <div className={`w-1.5 self-stretch rounded-full ${risk.dot} flex-shrink-0`} />
                                            <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
                                                <div className="min-w-0">
                                                    <div className="text-white font-semibold text-sm truncate">{pred.district}</div>
                                                    <div className="text-white/30 text-xs">{pred.land} acres · {pred.soil}</div>
                                                </div>
                                                <div className="hidden md:block text-white/50 text-sm">
                                                    {SEASON_EMOJI[pred.season]} {pred.season}
                                                </div>
                                                <div className="hidden md:flex flex-wrap gap-1">
                                                    {(pred.crops ?? []).slice(0, 2).map((c, ci) => (
                                                        <span key={ci} className="text-xs px-2 py-0.5 bg-[#4ade80]/8 text-[#4ade80] rounded-md">
                                                            {c.name?.split("(")[0].trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-white/40">
                                                    {pred.weather?.temperature}°C · {pred.weather?.humidity}%
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`text-xs font-semibold ${risk.text}`}>{pred.riskLevel} Risk</span>
                                                    <button onClick={() => handleDelete(pred._id)} className="text-white/20 hover:text-red-400 transition-colors">
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}