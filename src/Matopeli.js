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
    width: 15,
    height: 10,
  };
  const allCells = [];
  for (let x = 0; x < world.width; x++) {
    for (let y = 0; y < world.height; y++) {
      allCells.push({x, y});
    }
  }

  world.worm = [{
    x: Math.floor(world.width / 2),
    y: Math.floor(world.height / 2),
  }];
  world.direction = {x: 1, y: 0};
  world.score = 0;
  world.target = randomEmptyCell();

  function sumVectors(v1, v2) {
    return {
      x: v1.x + v2.x,
      y: v1.y + v2.y,
    }
  }

  function isEmptyCell(cell) {
    for (const segment of world.worm) {
      if (isEqual(segment, cell)) {
        return false;
      }
    }
    return true;
  }

  function randomEmptyCell() {
    const emptyCells = allCells.filter(isEmptyCell);
    if (emptyCells.length <= 0) {
      return null;
    }
    const randomIndex = random(0, emptyCells.length);
    return emptyCells[randomIndex];
  }

  function move(worm, direction) {
    const head = worm[0];
    const newHead = sumVectors(head, direction);
    const newTail = worm.slice(0, -1); // TODO: not tested
    return [newHead, ...newTail];
  }

  function hitsTail(worm) {
    const [head, ...tail] = worm;
    for (const segment of tail) {
      if (isEqual(head, segment)) {
        return true;
      }
    }
    return false;
  }

  function hitsWalls(worm) {
    for (const segment of worm) {
      if (segment.x < 0 || segment.x >= world.width ||
        segment.y < 0 || segment.y >= world.height) {
        return true;
      }
    }
    return false;
  }

  function eatsTheTarget(worm) {
    return isEqual(worm[0], world.target);
  }

  world.changeDirection = (direction) => {
    const turn180 = isEqual(sumVectors(world.direction, direction), {x: 0, y: 0});
    if (!turn180 || world.worm.length === 1) {
      // Do not update the direction immediately, but only during
      // the next simulation tick. Otherwise it would be possible to
      // do a 180 turn by pressing two arrows within one tick.
      world.newDirection = direction;
    }
  };

  world.simulate = () => {
    if (world.gameOver) {
      return;
    }
    if (world.newDirection) {
      world.direction = world.newDirection;
      world.newDirection = null;
    }

    const oldWorm = world.worm;
    const newWorm = move(oldWorm, world.direction);
    if (hitsWalls(newWorm) || hitsTail(newWorm)) {
      world.gameOver = true;
      console.log("Game over");

    } else if (eatsTheTarget(newWorm)) {
      const tail = oldWorm[oldWorm.length - 1];
      world.worm = [...newWorm, tail];
      world.score++;
      world.target = randomEmptyCell();
      console.log(`Score: ${world.score}`);

    } else {
      world.worm = newWorm;
    }
  };

  return world;
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
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.lineJoin = 'round';
    ctx.strokeText('Game Over', canvasWidth / 2, canvasHeight / 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Game Over', canvasWidth / 2, canvasHeight / 2);

    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    ctx.strokeText(`Score: ${world.score}`, canvasWidth / 2, canvasHeight / 2 + 36);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Score: ${world.score}`, canvasWidth / 2, canvasHeight / 2 + 36);
  }
}


// Main

function initGame(canvas) {
  let world = createWorld();

  const rendererHz = 60;
  setInterval(() => renderWorld(world, canvas), 1000.0 / rendererHz);

  const simulationHz = 6;
  setInterval(() => world.simulate(), 1000.0 / simulationHz);

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
