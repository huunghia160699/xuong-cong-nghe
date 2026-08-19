import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151513",
        paper: "#f7f7f3",
        mist: "#ecece7",
        lime: "#c8f13b",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(15, 15, 14, 0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
