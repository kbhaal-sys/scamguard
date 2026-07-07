import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF8F4",
        ink: "#1C2B39",
        inkmut: "#5A6B7A",
        guard: { DEFAULT: "#1A5FD0", dark: "#12459C", soft: "#E5EEFB" },
        risk: {
          low: "#1E8E3E",
          medium: "#B45309",
          high: "#D93025",
          critical: "#7F1D1D",
        },
        line: "#E5E0D6",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
