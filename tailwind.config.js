/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4f46e5',
        'secondary': '#047857',
        'light-bg': '#f9fafb',
        'dark-text': '#111827',
        'medium-text': '#4b5563',
        'light-text': '#6b7280',
        'border-color': '#e5e7eb',
      },
      boxShadow: {
        'custom': '0 2px 8px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
