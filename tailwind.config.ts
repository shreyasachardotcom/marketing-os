import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome base from PRD
        black: "#000000",
        "dark-gray": "#404040",
        "medium-gray": "#808080",
        "light-gray": "#E5E5E5",
        white: "#FFFFFF",

        // Accent colors (used sparingly)
        primary: "#3B82F6",
        success: "#10B981",
        warning: "#EF4444",

        // shadcn/ui compatibility
        border: "#E5E5E5",
        input: "#E5E5E5",
        ring: "#3B82F6",
        background: "#FFFFFF",
        foreground: "#000000",
        muted: {
          DEFAULT: "#E5E5E5",
          foreground: "#404040",
        },
        accent: {
          DEFAULT: "#E5E5E5",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E5E5E5",
          foreground: "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        // Typography from PRD
        "h1": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "h2": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "h3": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "body": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "small": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
