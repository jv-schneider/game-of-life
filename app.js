const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Important global variables

let grid = [];
let pixelSize = 50;

let canvasWidth;
let canvasHeight;

// Classes

class Pixel {
  constructor(state, position) {
    this.state = state;
    this.position = position;
  }
}

// Functions to get started

sizeCanvas();
drawGrid();

// If a pixel is alive, color it white

function drawGrid() {
  ctx.fillStyle = "white";

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].state == 1) {
      ctx.fillRect(
        grid[i].position[0],
        grid[i].position[1],
        pixelSize,
        pixelSize
      );
    }
  }
}

function getPosition(client, rect) {
  let y = 0;
  let x = Math.floor(client[0] / pixelSize);
  if (
    Math.floor(client[1] / pixelSize) * Math.floor(canvasWidth / pixelSize) !=
    0
  ) {
    y = Math.floor(client[1] / pixelSize) * Math.floor(canvasWidth / pixelSize);
  }
  return x + y;
}

function drawPixel(event) {
  let rect = event.target.getBoundingClientRect();
  let client = [event.clientX - rect.left, event.clientY - rect.top];
  if (client[0] > simulationSize[0] || client[1] > simulationSize[1]) {
    return;
  }
  grid[getPosition(client, rect)].state = 1;
  drawGrid();
}

function sizeCanvas() {
  canvas.width = window.innerWidth - 100;
  canvas.height = window.innerHeight - 100;
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  drawLines();

  grid = [];
  simulationSize = [
    Math.floor(canvasWidth / pixelSize) * pixelSize,
    Math.floor(canvasHeight / pixelSize) * pixelSize,
  ];

  for (let i = 0; i < canvasHeight - pixelSize; i += pixelSize) {
    for (let j = 0; j < canvasWidth - pixelSize; j += pixelSize) {
      grid.push(new Pixel(0, [j, i]));
    }
  }
}

function drawLines() {
  for (let i = pixelSize; i < canvasWidth; i += pixelSize) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvasHeight);
  }
  for (let i = pixelSize; i < canvasHeight; i += pixelSize) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvasWidth, i);
  }

  ctx.strokeStyle = "#ffffff66";
  ctx.stroke();
}

window.addEventListener("resize", sizeCanvas);
canvas.addEventListener("click", drawPixel);
