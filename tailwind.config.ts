import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          espresso: {
            DEFAULT: "#2C1A11",
            light: "#3F2618",
            dark: "#1A0F0A",
          },
          latte: {
            DEFAULT: "#FAF7F2",
            subtle: "#F4EFE6",
            border: "#E9DFD1",
          },
          terracotta: {
            DEFAULT: "#C86D3B",
            hover: "#B65E2D",
            light: "#F5ECE5",
          },
          botanical: {
            DEFAULT: "#2D5A3D",
            hover: "#234730",
            light: "#EAF2EC",
          },
          amber: {
            DEFAULT: "#D4AF37",
            light: "#FDF8E7",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
