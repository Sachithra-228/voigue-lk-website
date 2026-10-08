import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
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
        sans: ["var(--font-geist)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
