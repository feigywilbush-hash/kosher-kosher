import type { Config } from "tailwindcss";

const token = (v: string) => `hsl(var(--${v}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: { cmp: "760px", dsk: "1120px" },
      // Sizes only: the design relies on line-height: normal unless set explicitly.
      fontSize: { xs: "12px", sm: "14px", base: "16px", lg: "18px", xl: "20px", "4xl": "36px" },
      colors: {
        ink: token("ink"),
        navy: token("navy"),
        blue: token("blue"),
        sky: token("sky"),
        paper: token("paper"),
        muted: token("muted"),
        mist: token("mist"),
        soft: token("soft"),
        tint: token("tint"),
        deep: token("deep"),
        accent: { DEFAULT: token("accent"), hover: token("accent-hover") },
        meat: { DEFAULT: token("meat"), bg: token("meat-bg") },
        dairy: { bg: token("dairy-bg") },
        parve: { bg: token("parve-bg") },
      },
      fontFamily: {
        display: ["Manhattan", "serif"],
        body: ["Polin", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
