import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        arabic: ["var(--font-noto-sans-arabic)"],
      },
      colors: {
        primary: "hsl(var(--primary))",
        "primary-light": "hsl(var(--primary-light))",
        secondary: "hsl(var(--secondary))",
        neutral: "hsl(var(--neutral))",
        dark: "hsl(var(--dark))",
        light: "hsl(var(--light))",
        "dark-accent": "hsl(var(--dark-accent))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // primary: {
        //   DEFAULT: "#583972",
        //   foreground: "#FFFFFF",
        // },
        // secondary: {
        //   DEFAULT: "#EA8F31",
        //   foreground: "#000000",
        // },
        destructive: {
          DEFAULT: "#FF3333",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#B9704D",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#B9704D",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
