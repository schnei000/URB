/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        success: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
        dark: "#111827",
        light: "#f3f4f6"
      }
    },
  },
  plugins: [],
}
