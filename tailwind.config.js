/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
const config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
        // 1. EL COLOR DE MARCA (Navbar, Botones principales, Enlaces)
        primary: {
          DEFAULT: colors.indigo[600], // Color base
          hover: colors.indigo[700],   // Para estados hover
          light: colors.indigo[50],    // Fondos muy suaves de marca
          foreground: colors.indigo[50], // Added for compatibility with shadcn if needed, or just white
        },
        
        // 2. EL COLOR DE ACCIÓN/GAMIFICACIÓN (Barras de progreso, XP, Medallas)
        accent: {
          DEFAULT: colors.amber[500],
          hover: colors.amber[600],
          foreground: colors.amber[900],
        },

        // 3. BASES NEUTRAS (Para lectura cómoda)
        slate: colors.slate, // Re-exportamos slate para usarlo como gris base
        
        // 4. SEMÁNTICOS (Estados del curso)
        success: colors.emerald[500], // Curso completado
        error: colors.rose[500],      // Examen fallido
        warning: colors.orange[400],  // Fecha límite cercana

        // Existing shadcn variables mapped to new colors or kept as is where appropriate
        // We need to keep the standard shadcn keys to avoid breaking components completely
        // but we can map them to our new palette where it makes sense.
        // However, the user asked to create semantic aliases.
        // Let's keep the existing structure but override specific ones or add the new ones.
        // The user provided a specific structure. I will use that structure and try to merge/keep necessary shadcn keys if they don't conflict, 
        // OR I will assume the user wants to fully control these keys.
        // Given the user said "No uses colores directamente, crea alias semánticos" and provided a specific block,
        // I should prioritize their block.
        // BUT, removing 'background', 'foreground', 'card', 'popover', 'secondary', 'muted', 'destructive', 'border', 'input', 'ring' 
        // might break the app if it relies heavily on them (which shadcn does).
        // I will keep the shadcn variables for the keys the user DID NOT specify, and override the ones they did (primary, accent).
        // And add the new ones.
        
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
        // Primary is overridden above, but let's make sure we don't have duplicates.
        // The user's primary is an object with DEFAULT, hover, light.
        // Shadcn expects primary to be a color string usually, or an object with DEFAULT and foreground.
        // I will merge them carefully.
        
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
        // Accent is overridden above.
        
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // Inter es excelente para UI
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
