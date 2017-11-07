import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DatePicker from './DatePicker';

class App extends Component {
  render() {
    const period = {
      startYear: 2017,
      endYear: 2018,
      semester: 1
    };

    const availability = {
      '8 sy': true,
      '9 sy': true,
      '10 sy': true,
      '11 sy': true,
      '12 sy': true,
      '1 ey': true,
      '2 ey': true,
      '3 ey': true,
      '4 ey': true,
      '5 ey': true,
      '6 ey': true,
      '7 ey': false,
      '8 ey': false
    };

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">uHub Reservations</h1>
        </header>

        <DatePicker
          period={period}
          availability={availability}
        />
      </div>
    );
  }
}

export default App;
