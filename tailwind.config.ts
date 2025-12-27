import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Space Mono', 'JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Space Grotesk', 'Arial', 'sans-serif'],
      },
      colors: {
        papel: '#FFFEF2',
        negro: '#000000',
        rojo: '#FF0000',
        amarillo: '#FFD700',
        blanco: '#FFFFFF',
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px #000000',
        'brutal-sm': '4px 4px 0px 0px #000000',
        'brutal-lg': '12px 12px 0px 0px #000000',
        'brutal-hover': '6px 6px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
      },
    },
  },
  plugins: [],
};

export default config;
