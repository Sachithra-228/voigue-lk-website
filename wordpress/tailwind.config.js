/** Tailwind build for the Voigue WordPress theme. Run from the project root: npm run wp:css */
module.exports = {
  content: ["./wordpress/voigue-theme/**/*.php", "./wordpress/voigue-theme/assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        ink: "hsl(var(--ink) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        paper: "hsl(var(--paper) / <alpha-value>)",
        line: "hsl(var(--line) / <alpha-value>)",
        brand: {
          navy: "hsl(var(--brand-navy) / <alpha-value>)",
          blue: "hsl(var(--brand-blue) / <alpha-value>)",
          teal: "hsl(var(--brand-teal) / <alpha-value>)",
          copper: "hsl(var(--brand-copper) / <alpha-value>)",
          violet: "hsl(var(--brand-violet) / <alpha-value>)"
        },
        lilac: {
          DEFAULT: "hsl(var(--lilac) / <alpha-value>)",
          deep: "hsl(var(--lilac-deep) / <alpha-value>)"
        }
      },
      boxShadow: {
        soft: "0 18px 60px hsl(278 63% 26% / 0.14)"
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
