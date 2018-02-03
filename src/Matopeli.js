import React, {Component} from 'react';
import './Matopeli.css';

const UP = {x: 0, y: -1};
const DOWN = {x: 0, y: 1};
const LEFT = {x: -1, y: 0};
const RIGHT = {x: 1, y: 0};

function createWorld() {
  const world = {
    width: 30,
    height: 20,
  };
  const head = {
    x: world.width / 2,
    y: world.height / 2,
  };
  world.worm = [head];
  world.direction = {x: 1, y: 0};
  return world;
}


// Helpers

function sumVectors(v1, v2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  }
}


// Simulation

function move(worm, direction) {
  const head = worm[0];
  const newHead = sumVectors(head, direction);
  const newTail = worm.slice(0, -1); // TODO: not tested
  return [newHead, ...newTail];
}

function hitsWalls(worm, world) {
  for (const block of worm) {
    if (block.x < 0 || block.x >= world.width ||
      block.y < 0 || block.y >= world.height) {
      return true;
    }
  }
  return false;
}

function simulateWorld(world) {
  const newWorm = move(world.worm, world.direction);
  if (hitsWalls(newWorm, world)) {
    world.gameOver = true;
  } else {
    world.worm = newWorm;
  }
}


// Rendering

function renderWorld(world, canvas) {
  const ctx = canvas.getContext('2d');
  const canvasWidth = canvas.width = canvas.clientWidth;
  const canvasHeight = canvas.height = canvas.clientHeight;
  const cellWidth = canvasWidth / world.width;
  const cellHeight = canvasHeight / world.height;

  // background color
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // worm
  ctx.fillStyle = '#000000';
  for (const block of world.worm) {
    ctx.fillRect(block.x * cellWidth, block.y * cellHeight, cellWidth, cellHeight);
  }

  // game over
  if (world.gameOver) {
    ctx.font = 'bold 48px sans-serif';
    ctx.fillStyle = '#0000FF';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvasWidth / 2, canvasHeight / 2);

    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#0000FF';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${world.worm.length}`, canvasWidth / 2, canvasHeight / 2 + 36);
  }
}


// Main

function initGame(canvas) {
  const world = createWorld();

  const rendererHz = 60;
  setInterval(() => renderWorld(world, canvas), 1000.0 / rendererHz);

  const simulationHz = 10;
  setInterval(() => simulateWorld(world), 1000.0 / simulationHz);

  document.addEventListener('keydown', (event) => {
    if (world.gameOver) {
      return; // prevent any further input
    }
    if (event.key === 'ArrowUp') {
      world.direction = UP
    }
    if (event.key === 'ArrowDown') {
      world.direction = DOWN
    }
    if (event.key === 'ArrowLeft') {
      world.direction = LEFT
    }
    if (event.key === 'ArrowRight') {
      world.direction = RIGHT
    }
  });

  console.log("Game started");
}

class Matopeli extends Component {
  canvas = null;

  componentDidMount() {
    initGame(this.canvas)
  }

  render() {
    return (
      <canvas className="matopeli" ref={element => this.canvas = element}/>
    );
  }
}

export default Matopeli;
