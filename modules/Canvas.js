
const canvas = document.querySelector("[data-playing-field]");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth - 20;
canvas.height = innerHeight;

export { ctx, canvas };