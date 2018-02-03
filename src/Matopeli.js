import React, {Component} from 'react';
import './Matopeli.css';

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

function sumVectors(v1, v2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  }
}

function move(worm, direction) {
  const head = worm[0];
  const newHead = sumVectors(head, direction);
  const newTail = worm.slice(0, -1); // TODO: not tested
  return [newHead, ...newTail];
}

function simulateWorld(world) {
  world.worm = move(world.worm, world.direction);
}

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
}

function initGame(canvas) {
  console.log("Start game");
  const world = createWorld();

  const rendererHz = 60;
  setInterval(() => renderWorld(world, canvas), 1000.0 / rendererHz);

  const simulationHz = 10;
  setInterval(() => simulateWorld(world), 1000.0 / simulationHz);
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
