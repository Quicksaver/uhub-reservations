import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DatePicker from './DatePicker';

const dates = {
  1: {
    period: {
      startYear: 2017,
      endYear: 2018,
      semester: 1
    },
    availability: {
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
    }
  },
  2: {
    period: {
      startYear: 2017,
      endYear: 2018,
      semester: 2
    },
    availability: {
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
      '7 ey': true,
      '8 ey': true
    }
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: 1
    };

    this.changeDate = this.changeDate.bind(this);
  }

  changeDate(event) {
    this.setState({ date: event.target.value });
  }

  render() {
    const { period, availability } = dates[this.state.date];

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">uHub Reservations</h1>
        </header>

        <select onChange={this.changeDate} value={this.state.date}>
          <option value="1">1st Sem 17/18</option>
          <option value="2">2nd Sem 17/18</option>
        </select>

        <DatePicker
          period={period}
          availability={availability}
        />
      </div>
    );
  }
}

export default App;
