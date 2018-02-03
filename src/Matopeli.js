import React, {Component} from 'react';
import './Matopeli.css';

function startGame(canvas) {
  console.log("Start game");
}

class Matopeli extends Component {
  canvas = null;

  componentDidMount() {
    startGame(this.canvas)
  }

  render() {
    return (
      <canvas className="matopeli" ref={element => this.canvas = element}/>
    );
  }
}

export default Matopeli;
