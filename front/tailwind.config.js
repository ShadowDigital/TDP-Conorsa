/** 
 * \@type {import('tailwindcss').Config} 
 * Define la configuración principal de Tailwind CSS para el proyecto.
 */
export default {
  // 'content' indica a Tailwind dónde buscar las clases CSS (en archivos HTML, JS, TS, JSX, TSX).
  // Solo el CSS necesario para las clases encontradas aquí se incluirá en el build final.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // 'theme' permite personalizar el diseño (colores, fuentes, espaciados, etc.)
  theme: {
    // 'extend' sirve para AGREGAR o EXTENDER los estilos por defecto de Tailwind sin sobrescribir los existentes.
    extend: {
      // Configuramos una fuente personalizada. Aquí establecemos 'Inter' como la fuente principal (sans).
      // Si usamos la clase 'font-sans', Tailwind aplicará esta familia tipográfica.
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Agregamos una paleta de colores personalizada llamada 'brand' (marca).
      // Nos permite usar clases como 'bg-brand-500', 'text-brand-600', 'border-brand-400', etc.
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1A4FD6',
          700: '#1238a0',
          800: '#0d2570',
          900: '#0a1a50',
        },
      },
    },
  },
  
  // 'plugins' permite añadir extensiones oficiales o de terceros a Tailwind (por ejemplo, formularios, tipografía).
  plugins: [],
}
