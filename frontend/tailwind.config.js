/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Spline Sans"', 'system-ui', 'sans-serif'],
        display: ['"Zen Kaku Gothic New"', 'sans-serif'],
      },
      colors: {
        ink: "#0F172A",     // Slate 900
        mist: "#F1F5F9",    // Slate 100
        night: "#020617",   // Slate 950
        teal: "#14B8A6",    // Teal 500
        amber: "#F59E0B",   // Amber 500
        coral: "#F43F5E",   // Rose 500
        primary: "#14B8A6", // Alias for main brand color
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(20, 184, 166, 0.3)',
      }
    },
  },
  plugins: [],
}
