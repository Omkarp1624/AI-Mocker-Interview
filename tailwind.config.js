/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./pages/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
      "./layouts/**/*.{js,jsx,ts,tsx}",
      "./utilities/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: "var(--primary)",
          secondary: "var(--secondary)",
          accent: "var(--accent)",
          neutral: "#3d3d3d",
          base: "#ffffff"
        },
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        borderRadius: {
          'xl': '1rem',
          '2xl': '1.5rem',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          serif: ['Merriweather', 'serif']
        },
      },
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
