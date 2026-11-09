import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
          dark: "#991B1B",
          hover: "#B91C1C",
          muted: "#FCA5A5",
        },
        surface: {
          bg: "#F5F4F0",
          card: "#FFFFFF",
          elevated: "#F3F4F6",
        },
        coral: "#F28B6E",
        teal: "#2A9D8F",
        ink: {
          DEFAULT: "#111111",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-in-right":
          "slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.25s ease both",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.6s infinite linear",
        "pulse-dot": "pulseDot 1.5s ease-in-out infinite",
        "bounce-soft": "bounceSoft 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
        "count-up": "fadeIn 0.6s ease both",
        progress: "progressFill 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-7px)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.94)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-600px 0" },
          "100%": { backgroundPosition: "600px 0" },
        },
        pulseDot: {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.6" },
        },
        bounceSoft: {
          "0%,100%": { transform: "scale(1)" },
          "40%": { transform: "scale(0.93)" },
          "70%": { transform: "scale(1.06)" },
        },
        progressFill: {
          from: { width: "0%" },
          to: { width: "var(--progress-width)" },
        },
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.07)",
        "card-hover": "0 6px 24px rgba(0,0,0,0.12)",
        button: "0 4px 14px rgba(200,16,46,0.35)",
        "button-hover": "0 6px 20px rgba(200,16,46,0.5)",
        float: "0 10px 30px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
