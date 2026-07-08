/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados (compatibles con DaisyUI)
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        accent: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
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
        // Tema personalizado "azul-amarillo-gris"
        'azul-amarillo-gris': {
          "primary": "#2563EB",        // Azul principal
          "primary-focus": "#1D4ED8",  // Azul oscuro
          "primary-content": "#FFFFFF",

          "secondary": "#F59E0B",      // Amarillo principal
          "secondary-focus": "#D97706",// Amarillo oscuro
          "secondary-content": "#FFFFFF",

          "accent": "#6B7280",         // Gris principal
          "accent-focus": "#4B5563",   // Gris oscuro
          "accent-content": "#FFFFFF",

          "neutral": "#1F2937",        // Gris oscuro
          "neutral-focus": "#111827",
          "neutral-content": "#F9FAFB",

          "base-100": "#FFFFFF",       // Fondo blanco
          "base-200": "#F3F4F6",       // Fondo gris claro
          "base-300": "#E5E7EB",       // Fondo gris
          "base-content": "#1F2937",   // Texto oscuro

          "info": "#3B82F6",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
      'light', // Tema light por defecto
      'dark',  // Tema dark por defecto
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
    themeRoot: ':root',
  },
}
