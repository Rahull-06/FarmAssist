import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const links = [
        { label: "Home", to: "/" },
        { label: "Dashboard", to: "/dashboard" },
        { label: "About", to: "/about" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-[#0f1a0e]/95 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.3)] border-b border-[#2a4a28]/40"
                    : "bg-transparent"
            }`}
            style={{ fontFamily: "'Sora', sans-serif" }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                        <div className="relative w-9 h-9 flex-shrink-0">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#4ade80] to-[#16a34a] opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="white" fillOpacity="0.2" />
                                    <path d="M12 6c0 0-4 3-4 7s4 5 4 5 4-1 4-5-4-7-4-7z" fill="white" fillOpacity="0.9" />
                                    <path d="M12 6v12M8 10c1.5 1 2.5 2.5 4 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">
                            Farm<span className="text-[#4ade80]">Assist</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map(({ label, to }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`relative px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                    location.pathname === to
                                        ? "text-[#4ade80]"
                                        : "text-white/70 hover:text-white"
                                }`}
                            >
                                {label}
                                <span
                                    className={`absolute bottom-1 left-5 right-5 h-px bg-[#4ade80] transition-all duration-300 ${
                                        location.pathname === to
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-40"
                                    }`}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center">
                        <Link
                            to="/"
                            onClick={() =>
                                setTimeout(
                                    () =>
                                        document
                                            .getElementById("input-section")
                                            ?.scrollIntoView({ behavior: "smooth" }),
                                    100
                                )
                            }
                            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white rounded-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Analysis
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                                menuOpen ? "rotate-45 translate-y-2" : ""
                            }`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                                menuOpen ? "opacity-0 scale-x-0" : ""
                            }`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                                menuOpen ? "-rotate-45 -translate-y-2" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="bg-[#0f1a0e]/98 backdrop-blur-xl border-t border-[#2a4a28]/40 px-6 py-4 space-y-1">
                    {links.map(({ label, to }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                location.pathname === to
                                    ? "text-[#4ade80] bg-[#4ade80]/10"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="pt-2">
                        <Link
                            to="/"
                            onClick={() => {
                                setMenuOpen(false);
                                setTimeout(
                                    () =>
                                        document
                                            .getElementById("input-section")
                                            ?.scrollIntoView({ behavior: "smooth" }),
                                    150
                                );
                            }}
                            className="block px-4 py-3 text-center text-sm font-semibold bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white rounded-xl"
                        >
                            Start Analysis
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}