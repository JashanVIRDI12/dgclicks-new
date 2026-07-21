import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#05070C",
        deep: "#0A1224",
        cobalt: "#2A5FD9",
        sky: {
          DEFAULT: "#6FB8F2",
          accent: "#6FB8F2",
        },
        "sky-deep": "#2E6BA8",
        mint: "#CEDB58",
        night: "#0E1A28",
        fog: "#A7BCD2",
        mist: "#7C8FA3",
        chrome: {
          DEFAULT: "#E8ECF2",
          dim: "#8B93A7",
        },
        // Light theme
        ink: "#0F1B2D",
        slate: "#51617A",
        cloud: "#F4F6FA",
        mistpanel: "#E9EEF5",
      },
      fontFamily: {
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-azeret)", "ui-monospace", "monospace"],
      },
      fontSize: {
        eyebrow: [
          "0.6875rem",
          { lineHeight: "1.2", letterSpacing: "0.2em", fontWeight: "500" },
        ],
        caption: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
        body: ["1rem", { lineHeight: "1.65" }],
        subhead: [
          "clamp(1.125rem, 1.5vw, 1.375rem)",
          { lineHeight: "1.45", letterSpacing: "-0.01em" },
        ],
        headline: [
          "clamp(2.5rem, 6vw, 5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "500" },
        ],
        "headline-sm": [
          "clamp(1.75rem, 3.5vw, 2.75rem)",
          { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "500" },
        ],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 27, 45, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        lift: "0 20px 48px rgba(42, 95, 217, 0.16)",
      },
      borderRadius: {
        glass: "1.25rem",
        pill: "9999px",
      },
      transitionDuration: {
        glass: "220ms",
      },
    },
  },
  plugins: [],
};

export default config;
