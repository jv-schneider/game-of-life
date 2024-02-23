const canvas = document.querySelector("canvas");
const startButton = document.querySelector("button#start");
const clearButton = document.querySelector("button#clear");
const sizeSlider = document.querySelector("input#size");
const speedSlider = document.querySelector("input#speed");
const ctx = canvas.getContext("2d");

// Important global variables

let grid = [];
let pixelSize = 50;
let speed = 500;

let canvasWidth;
let canvasHeight;

let simInterval;

// Classes

class Pixel {
  constructor(state, position, neighborss) {
    this.state = state;
    this.position = position;
    this.neighborss = neighborss;
  }
}

// Functions to get started

sizeCanvas();
drawGrid();

function startStopSimulation() {
  if (startButton.innerHTML == "start") {
    clearInterval(simInterval);
    simInterval = setInterval(calculateGeneration, speed);
    startButton.innerHTML = "stop";
    startButton.classList.remove("green-button");
    startButton.classList.add("red-button");
  } else if (startButton.innerHTML == "stop") {
    clearInterval(simInterval);
    startButton.innerHTML = "start";
    startButton.classList.remove("red-button");
    startButton.classList.add("green-button");
  }
}

function clear() {
  clearInterval(simInterval);
  if (startButton.innerHTML == "stop") {
    startButton.innerHTML = "start";
    startButton.classList.remove("red-button");
    startButton.classList.add("green-button");
  }
  resetGrid();
  drawGrid();
}

function calculateGeneration() {
  // get state of pixels surrounding grid[i]

  getNeighbors();

  // apply game of life rules

  drawGrid();
  for (let i = 0; i < grid.length; i++) {
    if (
      grid[i].position[0] > 0 &&
      grid[i].position[0] < simulationSize[0] - pixelSize &&
      grid[i].position[1] > 0 &&
      grid[i].position[1] < simulationSize[1] - pixelSize
    ) {
      // Pixel dead, but 3 neighborss are alive: pixel alive
      if (
        grid[i].state == 0 &&
        grid[i].neighbors.filter((x) => x == 1).length == 3
      ) {
        grid[i].state = 1;
      }

      // Pixel alive, but less than 2 neighborss alive: pixel dead
      if (
        grid[i].state == 1 &&
        grid[i].neighbors.filter((x) => x == 1).length < 2
      ) {
        grid[i].state = 0;
      }

      // Pixel alive and 2 or 3 neighborss alive: pixel stays alive
      // else if (
      //   grid[i].state == 1 &&
      //   (pixelState.filter((x) => x == 1).length == 2 ||
      //     pixelState.filter((x) => x == 1).length == 3)
      // ) {
      //   grid[i].state = 1;
      // }

      // Pixel alive, but more than 3 neighborss alive: pixel dies
      if (
        grid[i].state == 1 &&
        grid[i].neighbors.filter((x) => x == 1).length > 3
      ) {
        grid[i].state = 0;
      }
    }
  }
}

function getNeighbors() {
  for (let i = 0; i < grid.length; i++) {
    grid[i].neighbors = [];
  }
  for (let i = 0; i < grid.length; i++) {
    if (
      grid[i].position[0] > 0 &&
      grid[i].position[0] < simulationSize[0] - pixelSize &&
      grid[i].position[1] > 0 &&
      grid[i].position[1] < simulationSize[1] - pixelSize
    ) {
      // Get state of the surrounding pixels

      grid[i].neighbors.push(grid[i + 1].state);
      grid[i].neighbors.push(grid[i - 1].state);

      grid[i].neighbors.push(grid[i + simulationSize[0] / pixelSize + 1].state);
      grid[i].neighbors.push(grid[i + simulationSize[0] / pixelSize].state);
      grid[i].neighbors.push(grid[i + simulationSize[0] / pixelSize - 1].state);

      grid[i].neighbors.push(grid[i - simulationSize[0] / pixelSize + 1].state);
      grid[i].neighbors.push(grid[i - simulationSize[0] / pixelSize].state);
      grid[i].neighbors.push(grid[i - simulationSize[0] / pixelSize - 1].state);
    }
  }
}

function changePixelSize() {
  clearInterval(simInterval);
  if (startButton.innerHTML == "stop") {
    startButton.innerHTML = "start";
    startButton.classList.remove("red-button");
    startButton.classList.add("green-button");
  }
  if (sizeSlider.value == 35) {
    pixelSize = 40;
  } else if (sizeSlider.value < 25) {
    pixelSize = 15;
  } else if (sizeSlider.value == 65) {
    pixelSize = 60;
  } else if (sizeSlider.value == 70) {
    pixelSize = 75;
  } else {
    pixelSize = parseInt(sizeSlider.value);
  }
  sizeCanvas();
}

function changeSpeed() {
  clearInterval(simInterval);
  if (startButton.innerHTML == "stop") {
    startButton.innerHTML = "start";
    startButton.classList.remove("red-button");
    startButton.classList.add("green-button");
  }
  speed = parseInt(speedSlider.value);
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
      grid.push(new Pixel(0, [j, i], []));
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
startButton.addEventListener("click", startStopSimulation);
sizeSlider.addEventListener("input", changePixelSize);
speedSlider.addEventListener("input", changeSpeed);
