import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blueprint: {
          DEFAULT: "#0B2545",   // deep drafting-table navy — primary bg
          line: "#1B3A6B",      // grid line blue
          light: "#274B7A",
        },
        paper: "#F5F3EE",       // tracing-paper card surface
        ink: "#101820",         // primary text on paper
        tape: "#E8871E",        // surveyor's-tape orange — accent / CTA
        approved: "#3A7D44",    // approved-stamp green
        pending: "#B0413E",     // rejection/pending red
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "grid-paper":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
    },
  },
  plugins: [],
};
export default config;
