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

class DatePicker extends Component {
  // Store an initial state for selected dates when the component is first initialized.
  constructor(props) {
    super(props);

    // Store an initial state for selected dates when the component is first initialized.
    this.state = {
      selected: this.getDatesFromSemester(props.period.semester)
    };

    console.log({ when: 'constructor', start: this.state.selected.start.date, end: this.state.selected.end.date });
  }

  // Update the internal state with the appropriate dates when picking another semester.
  componentDidUpdate() {
    let selected = this.getDatesFromSemester(this.props.period.semester);
    if(selected.start.month !== this.state.selected.start.month || selected.end.month !== this.state.selected.end.month) {
      this.setState({ selected }, () => {
        console.log({ when: 'componentDidUpdate', start: selected.start.date, end: selected.end.date });
      });
    }
  }

  // Get the appropriate start and end dates from a picked semester;
  // it checks for the availability of the semester's months and picks the closest ones possible.
  getDatesFromSemester(semester) {
    let availability = {};
    for(let month in this.props.availability) {
      availability[this.normalizeMonth(month)] = this.props.availability[month];
    }

    let period = semesters[semester];

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

  // Turns "8-ey" and "8-2018" to "Aug 18"; can also return the final strings to submit as "1-8-2018" or "31-8-2018".
  normalizeMonth(month, fulldate) {
    switch(fulldate) {
      case 'start': {
        return "1-" + month
          .replace(" ", "-")
          .replace("sy", this.props.period.startYear)
          .replace("ey", this.props.period.endYear);
      }

      case 'end': {
        let day;
        let date = month.split(" ");
        let year = date[1]
          .replace("sy", this.props.period.startYear)
          .replace("ey", this.props.period.endYear);

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
          .replace("sy", this.props.period.startYear.toString().substr(-2))
          .replace("ey", this.props.period.endYear.toString().substr(-2));
    }
  }

  // Render functions, everything related to actually showing the widget on the page.

  renderSemester(semester) {
    let className = "datepicker-semester";
    if(this.props.period.semester.toString() === semester.toString()) {
      className += " selected";
    }

    let startYear = this.props.period.startYear.toString().substr(-2);
    let endYear = this.props.period.endYear.toString().substr(-2);
    let sem = (semester.toString() === "1") ? "1st" : "2nd";
    let str = sem + " Sem " + startYear + "/" + endYear;

    return (<div key={semester} className={className}>{str}</div>);
  }

  renderMonth(month, i) {
    let className = "datepicker-month";
    if(!this.props.availability[month]) {
      className += " disabled";
    }
    if(i >= this.state.selected.start.i && i <= this.state.selected.end.i) {
      className += " selected";
    }

    let str = this.normalizeMonth(month);
    return (<div key={month} className={className}>{str}</div>);
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
