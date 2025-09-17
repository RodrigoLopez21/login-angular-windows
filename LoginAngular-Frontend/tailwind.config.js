/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/*.{html,ts}",
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite/**/**/*.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#fceef0",   // muy claro
          "100": "#f8d7dc",
          "200": "#f1aeb6",
          "300": "#e97d8a",
          "400": "#e04c5e",
          "500": "#c92e41",  // tono medio guindo
          "600": "#a32435",
          "700": "#801b2a",
          "800": "#5c121f",
          "900": "#3a0a14",  // muy oscuro
          "950": "#24060b"
        }
      },
      fontFamily: {
        body: [
          'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI',
          'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif',
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'
        ],
        sans: [
          'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI',
          'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif',
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'
        ]
      }
    }
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
    }),
  ],
}