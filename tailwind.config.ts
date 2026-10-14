import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#04122D",
        paper: "#F0F6FD",
        mist: "#E1EBF7",
        blue: "#005BFD",
        cyan: "#00E9FD",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(4, 18, 45, 0.07)",
      },
    },
  },
  plugins: [],
} satisfies Config;
