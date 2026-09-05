/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sxopop-primary': '#4F46E5',
        'sxopop-primary-dark': '#4338CA',
        'sxopop-secondary': '#0EA5E9',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'myanmar': ['"Noto Sans Myanmar"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
