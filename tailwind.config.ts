import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        space: {
          void: "#020617",
          deep: "#0F172A",
          surface: "#0B1220",
        },
        cyan: {
          DEFAULT: "#06B6D4",
        },
        violet: {
          DEFAULT: "#8B5CF6",
        },
        emerald: {
          DEFAULT: "#10B981",
        },
        amber: {
          DEFAULT: "#F59E0B",
          soft: "#FBBF24",
        },
        border: "rgba(148, 163, 184, 0.16)",
      },
      backgroundImage: {
        "grid-glow":
          "linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse at top, rgba(6,182,212,0.15), transparent 60%)",
        "sunset-fade":
          "radial-gradient(ellipse at bottom right, rgba(245,158,11,0.16), transparent 55%)",
        aurora:
          "linear-gradient(115deg, #06B6D4 0%, #8B5CF6 45%, #F59E0B 100%)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(6,182,212,0.25)",
        "glow-violet": "0 0 40px rgba(139,92,246,0.25)",
        "glow-amber": "0 0 40px rgba(245,158,11,0.25)",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        drift: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.9" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        drift: "drift 40s linear infinite",
        twinkle: "twinkle 5s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
