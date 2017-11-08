import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

// The months listed in the DatePicker widget;
//  sy: start year
//  ey: end year
const months = [
  '8 sy', '9 sy', '10 sy', '11 sy', '12 sy',
  '1 ey', '2 ey', '3 ey', '4 ey', '5 ey', '6 ey', '7 ey', '8 ey'
];
const semesters = {
  1: [ '9 sy', '10 sy', '11 sy', '12 sy', '1 ey' ],
  2: [ '2 ey', '3 ey', '4 ey', '5 ey', '6 ey', '7 ey' ]
};

// The minimum months required in a date selection.
const minimumMonths = 4;

class DatePicker extends Component {
  // Store an initial state for selected dates when the component is first initialized.
  constructor(props) {
    super(props);

    this.onMouseOverMonth = this.onMouseOverMonth.bind(this);
    this.onMouseOutMonth = this.onMouseOutMonth.bind(this);
    this.onClickMonth = this.onClickMonth.bind(this);

    // Store an initial state for selected dates when the component is first initialized.
    this.state = { ...props };
    this.state.selected = this.getDatesFromSemester();

    console.log({ when: 'constructor', start: this.state.selected.start.date, end: this.state.selected.end.date });
  }

  // Update the internal state with the appropriate dates when picking another semester.
  componentWillReceiveProps(nextProps) {
    this.setState(nextProps, () => {
      let selected = this.getDatesFromSemester();
      this.setState({ selected }, () => {
        console.log({ when: 'componentWillReceiveProps', start: selected.start.date, end: selected.end.date });
      });
    });
  }

  // Gets the month availabilities in a normalized object, or the availability of the supplied month.
  getAvailability(month) {
    let availability = {};
    for(let m in this.state.availability) {
      availability[this.normalizeMonth(m)] = this.state.availability[m];
    }
    if(month) {
      return !!availability[this.normalizeMonth(month)];
    }
    return availability;
  }

  // Get the appropriate start and end dates from a picked semester;
  // it checks for the availability of the semester's months and picks the closest ones possible.
  getDatesFromSemester() {
    let availability = this.getAvailability();
    let period = semesters[this.state.period.semester];

    let startI = 0;
    while(!availability[this.normalizeMonth(period[startI])] && startI < period.length) {
      startI++;
    }

    let endI = period.length -1;
    while(!availability[this.normalizeMonth(period[endI])] && endI >= 0) {
      endI--;
    }

    return {
      start: {
        i: months.indexOf(period[startI]),
        month: period[startI],
        date: this.normalizeMonth(period[startI], 'start')
      },
      end: {
        i: months.indexOf(period[endI]),
        month: period[endI],
        date: this.normalizeMonth(period[endI], 'end')
      }
    };
  }

  // Get the start and end dates from the widget month selection.
  getDatesFromSelection() {
    let nodes = document.querySelectorAll(".datepicker-month.selected");
    let start = months.indexOf(nodes[0].id);
    let end = months.indexOf(nodes[0].id);
    nodes.forEach((node) => {
      let i = months.indexOf(node.id);
      if(i < start) {
        start = i;
      } else if(i > end) {
        end = i;
      }
    });

    return {
      start: {
        i: start,
        month: months[start],
        date: this.normalizeMonth(months[start], 'start')
      },
      end: {
        i: end,
        month: months[end],
        date: this.normalizeMonth(months[end], 'end')
      }
    };
  }

  // Turns "8-ey" and "8-2018" to "Aug 18"; can also return the final strings to submit as "1-8-2018" or "31-8-2018".
  normalizeMonth(month, fulldate) {
    switch(fulldate) {
      case 'start': {
        return "1-" + month
          .replace(" ", "-")
          .replace("sy", this.state.period.startYear)
          .replace("ey", this.state.period.endYear);
      }

      case 'end': {
        let day;
        let date = month.split(" ");
        let year = date[1]
          .replace("sy", this.state.period.startYear)
          .replace("ey", this.state.period.endYear);

        switch(date[0]) {
          case "4":
          case "6":
          case "9":
          case "11":
            day = 31;
            break;

          case "2":
            day = (year % 4 === 0) ? 29 : 28;
            break;

          default:
            day = 31;
            break;
        }

        return day + "-" + date[0] + "-" + year;
      }

      default:
        return month
          .replace("10 ", "Oct ")
          .replace("11 ", "Nov ")
          .replace("12 ", "Dec ")
          .replace("1 ", "Jan ")
          .replace("2 ", "Feb ")
          .replace("3 ", "Mar ")
          .replace("4 ", "Apr ")
          .replace("5 ", "May ")
          .replace("6 ", "Jun ")
          .replace("7 ", "Jul ")
          .replace("8 ", "Aug ")
          .replace("9 ", "Sep ")
          .replace(" 20", "")
          .replace("sy", this.state.period.startYear.toString().substr(-2))
          .replace("ey", this.state.period.endYear.toString().substr(-2));
    }
  }

  onMouseOverMonth(event) {
    if(event.target.classList.contains("disabled")) {
      return;
    }
    let nodes = this.actionableMonths(event.target);
    if(!nodes.length) {
      event.target.classList.add("not-actionable");
    } else {
      nodes.forEach(function(target) {
        target.classList.add("hover");
      });
    }
  }

  onMouseOutMonth(event) {
    document.querySelectorAll(".datepicker-month").forEach(function(target) {
      target.classList.remove("hover");
      target.classList.remove("not-actionable");
    });
  }

  onClickMonth(event) {
    let select = !event.target.classList.contains("selected");

    this.actionableMonths(event.target).forEach(function(target) {
      if(select) {
        target.classList.add("selected");
      } else {
        target.classList.remove("selected");
      }
    });

    // Update the internal state with the newly un/selected months, if any.
    let selected = this.getDatesFromSelection();
    if(selected.start.month !== this.state.selected.start.month || selected.end.month !== this.state.selected.end.month) {
      this.setState({ selected }, () => {
        console.log({ when: 'onClickMonth', start: selected.start.date, end: selected.end.date });
      });
    }
  }

  // Returns an array of nodes for the actionable months.
  actionableMonths(target) {
    let month = target.id;
    let period = semesters[this.state.period.semester];
    let cutoff = (period.length /2) + months.indexOf(period[0]);
    let i = months.indexOf(month);

    // When trying to un-select a month...
    if(target.classList.contains("selected")) {

      // ...within the early period of the chosen semester...
      if(i < cutoff) {

        // ...needs to leave the minimum amount of months still selected.
        if(this.state.selected.end.i - i >= minimumMonths) {
          return months.slice(this.state.selected.start.i, i +1).map((m) => document.getElementById(m));
        }
      }

      // ...within the late period of the chosen semester...
      else {

        // ...needs to leave the minimum amount of months still selected.
        if(i - this.state.selected.start.i >= minimumMonths) {
          return months.slice(i, this.state.selected.end.i +1).map((m) => document.getElementById(m));
        }
      }
    }

    // When trying to select a month...
    else {

      // ..., which needs to be available,...
      if(this.getAvailability(month)) {

        // ...within the early period of the chosen semester.
        if(i < cutoff) {
          return months.slice(i, this.state.selected.start.i).map((m) => document.getElementById(m));
        }

        // ...within the late period of the chosen semester.
        else {
          return months.slice(this.state.selected.end.i +1, i +1).map((m) => document.getElementById(m));
        }
      }
    }

    // No actionable months for this action.
    return [];
  }

  // Render functions, everything related to actually showing the widget on the page.

  renderSemester(semester) {
    let className = "datepicker-semester";
    if(this.state.period.semester.toString() === semester.toString()) {
      className += " selected";
    }

    let startYear = this.state.period.startYear.toString().substr(-2);
    let endYear = this.state.period.endYear.toString().substr(-2);
    let sem = (semester.toString() === "1") ? "1st" : "2nd";
    let str = sem + " Sem " + startYear + "/" + endYear;

    return (<div key={semester} className={className}>{str}</div>);
  }

  renderMonth(month, i) {
    let className = "datepicker-month";
    if(!this.state.availability[month]) {
      className += " disabled";
    }
    if(i >= this.state.selected.start.i && i <= this.state.selected.end.i) {
      className += " selected";
    }

    let str = this.normalizeMonth(month);
    return (
      <div
        key={month}
        id={month}
        className={className}
        onMouseOver={this.onMouseOverMonth}
        onMouseOut={this.onMouseOutMonth}
        onClick={this.onClickMonth}>
        {str}
      </div>
    );
  }

  render() {
    return (
      <div className="datepicker">
        <div className="datepicker-semesters">
          {[1,2].map((semester) => this.renderSemester(semester))}
        </div>
        <div className="datepicker-months">
          {months.map((month, i) => this.renderMonth(month, i))}
        </div>
      </div>
    );
  }
}

DatePicker.propTypes = {
  period: PropTypes.shape({
    startYear: PropTypes.number.isRequired, // 2017
    endYear: PropTypes.number.isRequired,   // 2018
    semester: PropTypes.number.isRequired   // 1
  }).isRequired,
  availability: PropTypes.shape(Object.assign(...months.map((m) => ({ [m]: PropTypes.bool })))).isRequired
};

export default DatePicker;
