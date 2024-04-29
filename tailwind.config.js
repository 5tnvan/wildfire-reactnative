/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3D45E7",
        "primary-content": "#ffffff",
        secondary: "#373737",
        "secondary-content": "#ffffff",
        accent: "#B6F2CE",
        "accent-content": "#212638",
        neutral: "#ECECEC",
        "neutral-content": "#000000",
        "base-100": "#ffffff",
        "base-200": "#f4f8ff",
        "base-300": "#DAE8FF",
        "base-content": "#212638",
        info: "#93BBFB",
        success: "#34EEB6",
        warning: "#FFCF72",
        error: "#FF8863",
      },
    },
  },
  plugins: [],
};

