export default function ResultCard({ result }) {
    if (!result) return null;

    const riskColors = {
        Low: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-400",
            border: "border-emerald-500/30",
            dot: "bg-emerald-400",
        },
        Medium: {
            bg: "bg-amber-500/10",
            text: "text-amber-400",
            border: "border-amber-500/30",
            dot: "bg-amber-400",
        },
        High: {
            bg: "bg-red-500/10",
            text: "text-red-400",
            border: "border-red-500/30",
            dot: "bg-red-400",
        },
    };
    const risk = riskColors[result.riskLevel] ?? riskColors.Medium;

    const weatherIcons = {
        sunny: "☀️",
        cloudy: "☁️",
        rainy: "🌧️",
        foggy: "🌫️",
        "partly cloudy": "⛅",
        thunderstorm: "⛈️",
        clear: "🌤️",
    };
    const weatherIcon =
        weatherIcons[result.weather?.condition?.toLowerCase()] ?? "🌤️";

    return (
        <div className="animate-slideUp" style={{ fontFamily: "'Sora', sans-serif" }}>

            {/* Header */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-[#4ade80] to-[#16a34a] rounded-full flex-shrink-0" />
                <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                <div className="ml-auto text-xs text-white/40 font-mono">
                    {new Date().toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── Recommended Crops ── (spans 2 cols) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#1a2e18] to-[#0f1f0e] border border-[#2a4a28]/60 rounded-2xl p-6 relative overflow-hidden group hover:border-[#4ade80]/30 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#4ade80]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#4ade80]/8 transition-all duration-500 pointer-events-none" />

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-2xl">🌾</span>
                            <span className="text-sm font-semibold text-[#4ade80] tracking-widest uppercase">
                                Recommended Crops
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {result.crops.map((crop, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 bg-[#0f1a0e]/60 border border-[#2a4a28]/40 rounded-xl p-3.5 hover:border-[#4ade80]/40 hover:bg-[#4ade80]/5 transition-all duration-200 cursor-default"
                                >
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                                        style={{ background: `hsl(${120 + i * 15}, 30%, 15%)` }}
                                    >
                                        {crop.emoji}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-white font-semibold text-sm truncate">
                                            {crop.name}
                                        </div>
                                        <div className="text-white/40 text-xs mt-0.5">{crop.yield}</div>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <div className="text-[#4ade80] text-xs font-bold">{crop.confidence}%</div>
                                        <div className="text-white/30 text-xs">match</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Risk Level ── */}
                <div
                    className={`${risk.bg} border ${risk.border} rounded-2xl p-6 relative overflow-hidden`}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">⚠️</span>
                        <span className="text-sm font-semibold text-white/60 tracking-widest uppercase">
                            Risk Level
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${risk.dot} animate-pulse flex-shrink-0`} />
                        <span className={`text-3xl font-bold ${risk.text}`}>
                            {result.riskLevel}
                        </span>
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed mb-5">
                        {result.riskDescription}
                    </p>

                    <div className="space-y-2">
                        {result.riskFactors.map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                                <span className={`${risk.text} mt-0.5 flex-shrink-0`}>→</span>
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Weather Info ── */}
                <div className="bg-gradient-to-br from-[#0e1c2e] to-[#091528] border border-[#1e3a5f]/60 rounded-2xl p-6 relative overflow-hidden group hover:border-[#38bdf8]/30 transition-all duration-300">
                    <div className="absolute -bottom-6 -right-6 text-8xl opacity-10 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none select-none">
                        {weatherIcon}
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-xl">{weatherIcon}</span>
                            <span className="text-sm font-semibold text-[#38bdf8] tracking-widest uppercase">
                                Weather
                            </span>
                        </div>

                        <div className="text-5xl font-bold text-white mb-1">
                            {result.weather.temperature}°
                            <span className="text-white/30 text-2xl">C</span>
                        </div>
                        <div className="text-white/50 text-sm mb-5 capitalize">
                            {result.weather.condition}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-[#38bdf8] text-xs font-semibold mb-1 uppercase tracking-wider">
                                    Humidity
                                </div>
                                <div className="text-white font-bold text-lg">
                                    {result.weather.humidity}%
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-[#38bdf8] text-xs font-semibold mb-1 uppercase tracking-wider">
                                    Rainfall
                                </div>

                                {/* <div className="text-white font-bold text-lg">
                                    {result.weather.rainfall > 0 ? `${result.weather.rainfall}mm` : "—"}
                                </div> */}
                    
                                <div className="text-white font-bold text-lg">
                                    {result.weather.rainfall}mm
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── AI Advisory ── (spans 2 cols) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#1c1a2e] to-[#12102a] border border-[#3730a3]/40 rounded-2xl p-6 relative overflow-hidden group hover:border-[#818cf8]/30 transition-all duration-300">
                    <div className="absolute top-4 right-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#818cf8]/10 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                                <path d="M12 2a10 10 0 0 1 10 10" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-5">
                        <span className="text-xl">🤖</span>
                        <span className="text-sm font-semibold text-[#818cf8] tracking-widest uppercase">
                            AI Advisory
                        </span>
                    </div>

                    <p className="text-white/80 text-sm leading-7 mb-6">
                        {result.aiAdvice}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {result.actionItems.map((item, i) => (
                            <div
                                key={i}
                                className="bg-[#818cf8]/8 border border-[#818cf8]/20 rounded-xl p-3"
                            >
                                <div className="text-lg mb-1">{item.icon}</div>
                                <div className="text-white text-xs font-semibold">{item.title}</div>
                                <div className="text-white/40 text-xs mt-0.5">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}