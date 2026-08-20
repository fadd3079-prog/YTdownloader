/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#171717",
        "on-primary": "#ffffff",
        ink: "#171717",
        body: "#4d4d4d",
        mute: "#888888",
        hairline: "#ebebeb",
        "hairline-strong": "#a1a1a1",
        canvas: "#ffffff",
        "canvas-soft": "#fafafa",
        "canvas-soft-2": "#f5f5f5",
        link: "#0070f3",
        "link-deep": "#0761d1",
        "link-bg-soft": "#d3e5ff",
        success: "#0070f3",
        error: "#ee0000",
        "error-soft": "#f7d4d6",
        "error-deep": "#c50000",
        warning: "#f5a623",
        "warning-soft": "#ffefcf",
        "warning-deep": "#ab570a",
        violet: "#7928ca",
        cyan: "#50e3c2",
        "highlight-pink": "#ff0080",
        "gradient-develop-start": "#007cf0",
        "gradient-develop-end": "#00dfd8",
        "gradient-preview-start": "#7928ca",
        "gradient-preview-end": "#ff0080",
        "gradient-ship-start": "#ff4d4d",
        "gradient-ship-end": "#f9cb28",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
      boxShadow: {
        "level-1": "inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
        "level-2": "0px 1px 1px rgba(0, 0, 0, 0.02), 0px 2px 2px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
        "level-3": "0px 2px 2px rgba(0, 0, 0, 0.04), 0px 8px 8px -8px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
        "level-4": "0px 2px 2px rgba(0, 0, 0, 0.04), 0px 8px 16px -4px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
        "level-5": "0px 1px 1px rgba(0, 0, 0, 0.02), 0px 8px 16px -4px rgba(0, 0, 0, 0.04), 0px 24px 32px -8px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-gradient": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-gradient": "pulse-gradient 2s ease infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
}
