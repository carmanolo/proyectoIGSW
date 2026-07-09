/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        'azul-amarillo-gris': {
          "primary": "#2563EB",        // Azul principal
          "primary-focus": "#1D4ED8",  // Azul oscuro
          "primary-content": "#FFFFFF",

          "secondary": "#64748B",      // Gris pizarra
          "secondary-focus": "#475569",
          "secondary-content": "#FFFFFF",

          "accent": "#94A3B8",         // Gris claro
          "accent-focus": "#64748B",
          "accent-content": "#FFFFFF",

          "neutral": "#1E293B",        
          "neutral-focus": "#0F172A",
          "neutral-content": "#F8FAFC",

          "base-100": "#FFFFFF",       // Blanco
          "base-200": "#F0F9FF",       // Azul muy claro (Sky 50)
          "base-300": "#E0F2FE",       // Azul claro (Sky 100)
          "base-content": "#1E293B",   // Texto oscuro

          "info": "#0EA5E9",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
      'light',
      'dark',
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
    themeRoot: ':root',
  },
}