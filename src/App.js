import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DatePicker from './DatePicker';

// Periods come from the dropdown selector, which provides
// an index value to a pre-build collection of periods.
window._periods = {
  0: {
    startMonth: '9-2017',
    endMonth: '1-2018',
    before: 0,
    after: 0,
    minimum: 3
  },
  1: {
    startMonth: '2-2018',
    endMonth: '7-2018',
    minimum: 4
  },
  2: {
    startMonth: '9-2017',
    endMonth: '7-2018',
    minimum: 9
  },
  3: {
    startMonth: '8-2018',
    endMonth: '8-2018',
    minimum: 1
  }
};

// "before" and "after" are extra months that don't count towards the minimum
window._typologies = {
  0: {
    beforeMonths: 1,
    afterMonths: 2
  },
  1: {
    beforeMonths: 0,
    afterMonths: 0
  },
  2: {
    beforeMonths: 0,
    afterMonths: 1
  },
  3: {
    beforeMonths: 1,
    afterMonths: 1
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: 1
    };
  }

  changeDates(event) {
    let newEvent = new CustomEvent('updatedPeriodTypology', {
      bubbles: true,
      detail: {
        periodId: parseInt(document.getElementById('selector_period').value, 0),
        typologyId: parseInt(document.getElementById('selector_typology').value, 0)
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
          onChange={this.changeDates}
          defaultValue="0">

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
