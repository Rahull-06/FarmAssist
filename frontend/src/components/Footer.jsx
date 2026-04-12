import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { label: "Home", to: "/" },
        { label: "Dashboard", to: "/dashboard" },
        { label: "About", to: "/about" },
        { label: "Start Analysis", to: "/#input-section" },
    ];

    const techStack = [
        "React + Vite",
        "Node.js + Express",
        "MongoDB",
        "Tailwind CSS",
        "Weather API",
    ];

    return (
        <footer
            className="bg-[#070d06] border-t border-[#1a2e18]/60"
            style={{ fontFamily: "'Sora', sans-serif" }}
        >
            <div className="max-w-7xl mx-auto px-6 py-14">

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                    {/* Brand — spans 2 cols on md+ */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4ade80] to-[#16a34a] flex items-center justify-center flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 6c0 0-4 3-4 7s4 5 4 5 4-1 4-5-4-7-4-7z"
                                        fill="white"
                                        fillOpacity="0.9"
                                    />
                                    <path
                                        d="M12 6v12"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                            <span className="text-white font-bold text-lg">
                                Farm<span className="text-[#4ade80]">Assist</span>
                            </span>
                        </div>

                        <p className="text-white/30 text-sm leading-relaxed max-w-sm">
                            AI-powered crop advisory for Telangana farmers. Combining
                            agronomic science, weather intelligence, and local expertise to
                            drive better yields.
                        </p>

                        <div className="flex items-center gap-2 mt-5">
                            <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse flex-shrink-0" />
                            <span className="text-[#4ade80] text-xs font-semibold">
                                System Operational
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-5">
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            {navLinks.map(({ label, to }) => (
                                <li key={label}>
                                    <Link
                                        to={to}
                                        className="text-white/30 text-sm hover:text-[#4ade80] transition-colors duration-200"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-5">
                            Built With
                        </h4>
                        <ul className="space-y-3">
                            {techStack.map((tech) => (
                                <li
                                    key={tech}
                                    className="text-white/30 text-sm flex items-center gap-2"
                                >
                                    <span className="w-1 h-1 rounded-full bg-[#4ade80]/50 flex-shrink-0" />
                                    {tech}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#1a2e18]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-white/20 text-xs text-center sm:text-left">
                        © {currentYear} FarmAssist. Built for Telangana's farming community.
                    </p>
                    <p className="text-white/20 text-xs text-center sm:text-right">
                        MERN Stack · AI Advisory · Smart Agriculture
                    </p>
                </div>
            </div>
        </footer>
    );
}