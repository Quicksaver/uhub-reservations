import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

const months = [
  '8 sy', '9 sy', '10 sy', '11 sy', '12 sy',
  '1 ey', '2 ey', '3 ey', '4 ey', '5 ey', '6 ey', '7 ey', '8 ey'
];

class DatePicker extends Component {
  renderSemester(semester) {
    let className = "datepicker-semester" + ((this.props.period.semester.toString() !== semester.toString()) ? " disabled" : "");

    let startYear = this.props.period.startYear.toString().substr(-2);
    let endYear = this.props.period.endYear.toString().substr(-2);
    let sem = (semester.toString() === "1") ? "1st" : "2nd";
    let str = sem + " Sem " + startYear + "/" + endYear;

    return (<div key={semester} className={className}>{str}</div>);
  }

  renderMonth(month) {
    let className = "datepicker-month" + ((!this.props.availability[month]) ? " disabled" : "");

    let str = month
      .replace("10", "Oct")
      .replace("11", "Nov")
      .replace("12", "Dec")
      .replace("1", "Jan")
      .replace("2", "Feb")
      .replace("3", "Mar")
      .replace("4", "Apr")
      .replace("5", "May")
      .replace("6", "Jun")
      .replace("7", "Jul")
      .replace("8", "Aug")
      .replace("9", "Sep")
      .replace("sy", this.props.period.startYear.toString().substr(-2))
      .replace("ey", this.props.period.endYear.toString().substr(-2));

    return (<div key={month} className={className}>{str}</div>);
  }

  render() {
    return (
      <div className="datepicker">
        <div className="datepicker-semesters">
          {[1,2].map((semester) => this.renderSemester(semester))}
        </div>
        <div className="datepicker-months">
          {months.map((month) => this.renderMonth(month))}
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
  }),
  availability: PropTypes.shape(Object.assign(...months.map((m) => ({ [m]: PropTypes.bool.isRequired }))))
};

export default DatePicker;
