const canvas = document.querySelector("canvas");
const startButton = document.querySelector("button#start");
const clearButton = document.querySelector("button#clear");
const sizeSlider = document.querySelector("input#size");
const speedSlider = document.querySelector("input#speed");
const ctx = canvas.getContext("2d");

// Important global variables

let grid = [];
let pixelSize = 25;

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

function startSimulation() {
  pixelSize = parseInt(sizeSlider.value);
  sizeCanvas();

  for (let i = 0; i < grid.length; i++) {
    if (i % 2 == 0) {
      grid[i].state = 1;
    }
  }
  drawGrid();
}

function clear() {
  resetGrid();
  drawGrid();
}

// If a pixel is alive, color it white

function drawGrid() {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].state == 1) {
      ctx.fillStyle = "white";
      ctx.fillRect(
        grid[i].position[0],
        grid[i].position[1],
        pixelSize,
        pixelSize
      );
    } else {
      ctx.fillStyle = "#0c0c0c";
      ctx.fillRect(
        grid[i].position[0],
        grid[i].position[1],
        pixelSize,
        pixelSize
      );
    }
  }
  drawLines();
}

function getPosition(client) {
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
  if (grid[getPosition(client)].state == 0) {
    grid[getPosition(client)].state = 1;
  } else {
    grid[getPosition(client)].state = 0;
  }

  drawGrid();
}

function sizeCanvas() {
  canvas.width = window.innerWidth - 100;
  canvas.height = window.innerHeight - 50;
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  simulationSize = [
    Math.floor(canvasWidth / pixelSize) * pixelSize,
    Math.floor(canvasHeight / pixelSize) * pixelSize,
  ];

  drawLines();
  resetGrid();
}

function resetGrid() {
  grid = [];

  for (let i = 0; i < canvasHeight - pixelSize; i += pixelSize) {
    for (let j = 0; j < canvasWidth - pixelSize; j += pixelSize) {
      grid.push(new Pixel(0, [j, i]));
    }
  }
}

function drawLines() {
  ctx.strokeStyle = "#ffffff66";

  for (let i = pixelSize; i < simulationSize[0]; i += pixelSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, simulationSize[1]);
    ctx.stroke();
  }
  for (let i = pixelSize; i < simulationSize[1]; i += pixelSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(simulationSize[0], i);
    ctx.stroke();
  }
}

window.addEventListener("resize", sizeCanvas);
canvas.addEventListener("click", drawPixel);
clearButton.addEventListener("click", clear);
startButton.addEventListener("click", startSimulation);
