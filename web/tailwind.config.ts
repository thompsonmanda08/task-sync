import { heroui } from "@heroui/react";
import tailwindCSSAnimate from "tailwindcss-animate";

const PRIMARY_COLOR_SHADES = {
  DEFAULT: "#28b498",
  foreground: "#fcfcfc",
  light: "#C7F5EC",
  50: "#F0FCFA",
  100: "#D5F6EF",
  200: "#82E3D0",
  300: "#2ED1B0",
  400: "#28B498",
  500: "#058873",
  600: "#125F61",
  700: "#0D232B",
  800: "#143642",
  900: "#1C4C5D",
};

const SECONDARY_COLOR_SHADES = {
  DEFAULT: "#143642",
  foreground: "#fcfcfc",
  light: "#157679",
  50: "#F0FCFA",
  100: "#AEE8EA",
  200: "#71D1D4",
  300: "#229699",
  400: "#157679",
  500: "#058873",
  600: "#125F61",
  700: "#0D232B",
  800: "#143642",
  900: "#1C4C5D",
};

const config = {
  darkMode: ["class", "class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "960px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-round-card":
          "radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          ...PRIMARY_COLOR_SHADES,
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    tailwindCSSAnimate,
    heroui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            background: "#f5faf9",
            foreground: "#020705",
            default: {
              DEFAULT: "#82E3D0",
              foreground: "#2ED1B0",
              // ...DEFAULT_SHADES,
            },

            primary: PRIMARY_COLOR_SHADES,

            secondary: SECONDARY_COLOR_SHADES,
          },
        },
        dark: {
          colors: {
            background: "#020705",
            foreground: "#fcfcfc",
            content1: {
              DEFAULT: "#143642",
            },
            default: {
              DEFAULT: "#2ED1B0",
              foreground: "#28B498",
              // ...DEFAULT_DARK_SHADES,
            },
            primary: PRIMARY_COLOR_SHADES,
            secondary: SECONDARY_COLOR_SHADES,
          },
        },
      },
    }),
  ],
};

export default config;
