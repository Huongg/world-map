import React, { Component } from 'react';
import WorldMap from './WorldMap.js';
import Categories from './Categories.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Categories />
        <WorldMap />  
      </div>
    )
  }
}

export default App;
