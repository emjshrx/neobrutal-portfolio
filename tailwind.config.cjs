/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      white: "#ffffff",
      green: "#e9eddf",
      black: "#333532",
      pink: "#db2777",
    },
    extend: {
      keyframes: {
        curveIn1: {
          "0%,25%,100%": { "border-radius": "0%" },
          "5%": { "border-radius": "50%" },
          "20%": { "border-radius": "50%" },
        },
        curveIn2: {
          "50%, 25%": { "border-radius": "0%" },
          "30%": { "border-radius": "50%" },
          "45%": { "border-radius": "50%" },
        },
        curveIn3: {
          "50%, 75%": { "border-radius": "0%" },
          "55%": { "border-radius": "50%" },
          "70%": { "border-radius": "50%" },
        },
        curveIn4: {
          "75%, 100%": { "border-radius": "0%" },
          "80%": { "border-radius": "50%" },
          "95%": { "border-radius": "50%" },
        },
      },
      animation: {
        curveIn1: "curveIn1 800ms ease-in-out infinite",
        curveIn2: "curveIn2 800ms ease-in-out infinite",
        curveIn3: "curveIn3 800ms ease-in-out infinite",
        curveIn4: "curveIn4 800ms ease-in-out infinite",
      },
      dropShadow: {
        hard: "2px 4px 0px 0px #000000",
      },
    },
  },
  plugins: [],
};
