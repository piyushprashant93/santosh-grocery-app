import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--theme-bg)",
          surface: "var(--theme-surface)",
          text: "var(--theme-text)",
          muted: "var(--theme-muted)",
          border: "var(--theme-border)",
        },
      },
    }
  },
  plugins: []
}

export default config
