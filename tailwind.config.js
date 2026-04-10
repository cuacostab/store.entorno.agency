/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        "brand-hover": "var(--brand-hover)",
        accent: "var(--accent)",
      },
      borderRadius: {
        card: "var(--r-card)",
        btn: "var(--r-btn)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
