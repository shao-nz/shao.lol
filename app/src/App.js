/* eslint-disable */


import React, { Component } from 'react';
import logo from './static/cursed_flushed.png';
import './styles/App.css';
import { Tracker } from './Tracker'


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='App'>
          <h1>shao.lol tracker</h1>
          <img src={logo} />
          <Tracker />
      </div>
    );
  }
}

export default App;