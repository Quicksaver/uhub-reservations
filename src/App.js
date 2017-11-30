import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DatePicker from './DatePicker';

// Periods come from the dropdown selector, which provides
// an index value to a pre-build collection of periods.
window._periods = {
  0: {
    periodId: 0,
    periodStartMonth: '9-2017',
    periodEndMonth: '1-2018',
    periodMonthsBefore: 0,
    periodMonthsAfter: 0,
    periodMinimumMonths: 3
  },
  1: {
    periodId: 1,
    periodStartMonth: '2-2018',
    periodEndMonth: '7-2018',
    periodMinimumMonths: 4
  },
  2: {
    periodId: 2,
    periodStartMonth: '9-2017',
    periodEndMonth: '7-2018',
    periodMinimumMonths: 9
  },
  3: {
    periodId: 3,
    periodStartMonth: '8-2018',
    periodEndMonth: '8-2018',
    periodMinimumMonths: 1
  }
};

// "before" and "after" are extra months that don't count towards the minimum
window._typologies = {
  0: {
    typologyPeriodId: 0,
    monthsBefore: 1,
    monthsAfter: 2
  },
  1: {
    typologyPeriodId: 1,
    monthsBefore: 0,
    monthsAfter: 0
  },
  2: {
    typologyPeriodId: 2,
    monthsBefore: 0,
    monthsAfter: 1
  },
  3: {
    typologyPeriodId: 3,
    monthsBefore: 1,
    monthsAfter: 1
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: 1
    };

    window.addEventListener('updatedPeriodTypology', this);
    window.addEventListener('updatedDatePicked', this);
  }

  handleEvent(event) {
    console.log(Object.assign({ type: event.type }, event.detail));
  }

  changeDates(event) {
    let newEvent = new CustomEvent('updatedPeriodTypology', {
      bubbles: true,
      detail: {
        periodId: parseInt(document.getElementById('selector_period').value, 0),
        typologyPeriodId: parseInt(document.getElementById('selector_typology').value, 0),
        get period() {
          return window._periods[this.periodId];
        },
        get typologyPeriod() {
          return window._typologies[this.typologyPeriodId];
        }
      }
    });
    event.target.dispatchEvent(newEvent);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">uHub Reservations</h1>
        </header>

        <select id="selector_period"
          onChange={this.changeDates}
          defaultValue="0">

          <option value="0">1st Sem 17/18</option>
          <option value="1">2nd Sem 17/18</option>
          <option value="2">Year 18/19</option>
          <option value="3">Summer 18</option>
        </select>

        <select id="selector_typology"
          onChange={this.changeDates}>

          <option value="0">A room</option>
          <option value="1">Another room</option>
          <option value="2">Yet another room</option>
          <option value="3">Roomy room</option>
        </select>

        <DatePicker />
      </div>
    );
  }
}

export default App;
