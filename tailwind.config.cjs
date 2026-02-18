/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                toy: {
                    dark: '#0f0c29', // Deep Blue/Purple background base
                    purple: '#302b63', // Secondary background
                    black: '#24243e', // Tertiary background
                    neonBlue: '#00f3ff', // Cyan accent
                    neonPurple: '#bc13fe', // Purple accent
                    red: '#ff0055', // Toy Red
                    yellow: '#ffe600', // Sunshine Yellow
                    green: '#00ff9d', // Mint Green
                    light: '#ffffff', // Pure white for better contrast
                    text: '#e0e0e0', // Slightly off-white for body text
                    primary: '#ff00cc', // Primary brand color
                    secondary: '#333399', // Secondary brand color
                    accent: '#00ff9d', // Accent color
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Fredoka', 'cursive'],
            },
        },
    },
    plugins: [],
}
