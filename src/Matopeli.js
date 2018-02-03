import React, {Component} from 'react';
import './Matopeli.css';
import isEqual from "lodash/fp/isEqual";
import random from "lodash/fp/random";

const UP = {x: 0, y: -1};
const DOWN = {x: 0, y: 1};
const LEFT = {x: -1, y: 0};
const RIGHT = {x: 1, y: 0};

function createWorld() {
  const world = {
    width: 30,
    height: 20,
  };
  const allPositions = [];
  for (let x = 0; x < world.width; x++) {
    for (let y = 0; y < world.width; y++) {
      allPositions.push({x, y});
    }
  }

  const head = {
    x: world.width / 2,
    y: world.height / 2,
  };
  world.worm = [head];
  world.direction = {x: 1, y: 0};

  world.isEmpty = (position) => {
    for (const segment of world.worm) {
      if (isEqual(segment, position)) {
        return false;
      }
    }
    return true;
  };

  world.addTarget = () => {
    const emptyPositions = allPositions.filter(world.isEmpty);
    if (emptyPositions.length > 0) {
      const randomIndex = random(0, emptyPositions.length);
      world.target = emptyPositions[randomIndex];
    }
  };
  world.addTarget();

  world.changeDirection = (direction) => {
    const turn180 = isEqual(sumVectors(world.direction, direction), {x: 0, y: 0});
    if (!turn180) {
      world.direction = direction;
    }
  };

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
  for (const segment of worm) {
    if (segment.x < 0 || segment.x >= world.width ||
      segment.y < 0 || segment.y >= world.height) {
      return true;
    }
  }
  return false;
}

function simulateWorld(world) {
  if (world.gameOver) {
    return;
  }
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
  for (const segment of world.worm) {
    ctx.fillRect(segment.x * cellWidth, segment.y * cellHeight, cellWidth, cellHeight);
  }

  // target
  if (world.target) {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(
      world.target.x * cellWidth + cellWidth / 2,
      world.target.y * cellHeight + cellHeight / 2,
      cellWidth * 0.3,
      0, 2 * Math.PI);
    ctx.fill();
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
  let world = createWorld();

  const rendererHz = 60;
  setInterval(() => renderWorld(world, canvas), 1000.0 / rendererHz);

  const simulationHz = 10;
  setInterval(() => simulateWorld(world), 1000.0 / simulationHz);

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      world = createWorld();
    } else if (event.code === 'ArrowUp') {
      world.changeDirection(UP);
    } else if (event.code === 'ArrowDown') {
      world.changeDirection(DOWN);
    } else if (event.code === 'ArrowLeft') {
      world.changeDirection(LEFT);
    } else if (event.code === 'ArrowRight') {
      world.changeDirection(RIGHT);
    } else {
      return;
    }
    event.preventDefault(); // prevent game keys from scrolling the window
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
