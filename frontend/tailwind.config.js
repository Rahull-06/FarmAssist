export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sora: ["'Sora'", "sans-serif"],
            },
            animation: {
                slideUp: "slideUp 0.5s ease-out forwards",
                fadeIn: "fadeIn 0.4s ease-out forwards",
            },
            keyframes: {
                slideUp: {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};