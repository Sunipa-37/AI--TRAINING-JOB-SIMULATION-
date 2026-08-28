/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12172B",
        inksoft: "#545B75",
        bg: "#F5F6FA",
        border: "#E3E6F0",
        teal: "#14B8A6",
        violet: "#7C5CFF",
        amber: "#FFB020",
        coral: "#FF6B6B",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "18px",
      },
      keyframes: {
        blobMove: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(4%, 6%) scale(1.08)" },
          "66%": { transform: "translate(-3%, -4%) scale(0.95)" },
        },
        blobMoveSlow: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-5%, 5%) scale(1.1)" },
        },
      },
      animation: {
        blob1: "blobMove 22s ease-in-out infinite",
        blob2: "blobMoveSlow 28s ease-in-out infinite",
        blob3: "blobMove 34s ease-in-out infinite reverse",
      },
    },
  },
  plugins: [],
};
