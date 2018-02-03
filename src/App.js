import React, {Component} from 'react';
import './App.css';
import Matopeli from "./Matopeli";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Matopeli</h1>
        </header>
        <p className="App-intro">Kerää palloja törmäämättä mihinkään</p>
        <Matopeli/>
        <p className="App-controls">Käänny: ← ↑ → ↓
          <br/>Uusi peli: välilyönti</p>
      </div>
    );
  }
}

export default App;
