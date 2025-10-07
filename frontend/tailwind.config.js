/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Indian-inspired colors
        saffron: {
          50: '#FFF4E6',
          100: '#FFE4CC',
          200: '#FFC999',
          300: '#FFAE66',
          400: '#FFB366',
          500: '#FF9933', // Primary saffron
          600: '#E68A2E',
          700: '#CC7A29',
          800: '#B36B24',
          900: '#995C1F',
        },
        cream: {
          50: '#FFFCF5',
          100: '#FFF8E7', // Primary cream
          200: '#FFF0CC',
          300: '#FFE8B3',
          400: '#FFE099',
          500: '#FFD880',
          600: '#E6C473',
          700: '#CCB066',
          800: '#B39C59',
          900: '#99884C',
        },
        warmGreen: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50', // Primary green
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        accent: {
          yellow: '#FFD54F',
          orange: '#FF6F00',
        },
        // Dark mode colors
        dark: {
          bg: {
            primary: '#1A1A1A',
            secondary: '#242424',
            card: '#2D2D2D',
          },
          text: {
            primary: '#E0E0E0',
            secondary: '#B0B0B0',
          },
          border: '#404040',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'warm': '0 8px 20px rgba(255, 153, 51, 0.25)',
        'green': '0 8px 20px rgba(76, 175, 80, 0.25)',
        'glow': '0 0 20px rgba(255, 153, 51, 0.5)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FF9933 0%, #FFD54F 100%)',
        'gradient-hope': 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FF6F00 0%, #FF9933 100%)',
        'gradient-soft': 'linear-gradient(135deg, #FFF8E7 0%, #FFFFFF 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
