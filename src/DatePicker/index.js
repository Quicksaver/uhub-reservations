import React, { Component } from 'react';
import './style.css';

class DatePicker extends Component {
  // Store an initial state for selected dates when the component is first initialized.
  constructor(props) {
    super(props);

    this.onMouseOverMonth = this.onMouseOverMonth.bind(this);
    this.onMouseOutMonth = this.onMouseOutMonth.bind(this);
    this.onClickMonth = this.onClickMonth.bind(this);

    // Store an initial state for selected dates when the component is first initialized.
    this.state = null;

    // Listen for changes in typology or period selection.
    window.addEventListener('updatedPeriodTypology', this);
  }

  handleEvent(e) {
    switch (e.type) {
      // A selection/change was made in either the typology or the period selectors.
      // We should update our data accordingly.
      case 'updatedPeriodTypology':
        this.getDates(e.detail);
        break;

      default:
        break;
    }
  }

  // Get the initial selected dates based on the period and typology selection.
  getDates(state) {
    if (!state) { return; }

    if (!this.state ||
        this.state.period.periodId !== state.period.periodId ||
        (this.state.typologyPeriod && this.state.typologyPeriod.typologyPeriodId) !== (state.typologyPeriod && state.typologyPeriod.typologyPeriodId)) {

      state.selected = {
        start: state.period.periodStartMonth,
        end: state.period.periodEndMonth
      };
      this.setState(state, () => {
        const months = this.availableMonths();
        const nodes = document.querySelectorAll('.datepicker-month');
        nodes.forEach(function(target) {
          if (months.indexOf(target.id) > -1) {
            target.classList.add('selected');
          } else {
            target.classList.remove('selected');
          }
        });

        this.getDatesFromSelection();
      });
    }
  }

  // Get the start and end dates from the widget month selection.
  getDatesFromSelection() {
    const months = this.availableMonths(true);
    if (!months.length) {
      return;
    }

    const nodes = document.querySelectorAll(".datepicker-month.selected");
    const start = months.indexOf(nodes[0].id);
    const end = months.indexOf(nodes[nodes.length -1].id);

    const selected = {
      start: months[start],
      end: months[end]
    };

    if(!this.state || !this.state.selected || selected.start !== this.state.selected.start || selected.end !== this.state.selected.end) {
      this.setState({ selected }, () => {
        this.publishPickedDates();
      });
    }
    else {
      this.publishPickedDates();
    }
  }

  // Save the dates picked, given the typology and period selection, in a property of the window,
  // so it can be accessed directly when submitting the data.
  publishPickedDates() {
    window._datesPicked = {
      startDate: this.normalizeMonth(this.state.selected.start, 'start'),
      endDate: this.normalizeMonth(this.state.selected.end, 'end'),
      period: this.state.period,
      typologyPeriod: this.state.typologyPeriod,
      periodId: this.state.period.periodId,
      typologyPeriodId: this.state.typologyPeriod && this.state.typologyPeriod.typologyPeriodId
    };

    const event = new CustomEvent('updatedDatePicked', {
      bubbles: true,
      cancelable: false,
      detail: window._datesPicked
    });
    document.dispatchEvent(event);
  }

  // Turns "8-2018" to "Aug 18"; can also return the final strings to submit as "1-8-2018" or "31-8-2018".
  normalizeMonth(month, fulldate) {
    switch(fulldate) {
      case 'start': {
        return "1-" + month
          .replace(" ", "-");
      }

      case 'end': {
        let day;
        let date = month.split("-");
        let year = date[1];

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
          .replace("-", " ")
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
          .replace(" 20", " ");
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
    this.getDatesFromSelection();
  }

  // Returns an array of nodes for the actionable months.
  actionableMonths(target) {
    const months = this.availableMonths(true);
    const period = this.availableMonths();

    let month = target.id;
    let cutoff = (period.length /2) + months.indexOf(period[0]);
    let i = months.indexOf(month);

    // When trying to un-select a month...
    if(target.classList.contains("selected")) {

      // ...within the early period of the chosen semester...
      if(i < cutoff) {

        // ...needs to leave the minimum amount of months still selected.
        let minEndI = Math.min(months.indexOf(this.state.period.periodEndMonth), months.indexOf(this.state.selected.end));
        if(period.indexOf(month) === -1 || minEndI - i >= this.state.period.periodMinimumMonths) {
          return months.slice(months.indexOf(this.state.selected.start), i +1).map((m) => document.getElementById(m));
        }
      }

      // ...within the late period of the chosen semester...
      else {

        // ...needs to leave the minimum amount of months still selected.
        let maxStartI = Math.max(months.indexOf(this.state.period.periodStartMonth), months.indexOf(this.state.selected.start));
        if(period.indexOf(month) === -1 || i - maxStartI >= this.state.period.periodMinimumMonths) {
          return months.slice(i, months.indexOf(this.state.selected.end) +1).map((m) => document.getElementById(m));
        }
      }
    }

    // When trying to select a month...
    else {

      // ...within the early period of the chosen semester.
      if(i < cutoff) {
        return months.slice(i, months.indexOf(this.state.selected.start)).map((m) => document.getElementById(m));
      }

      // ...within the late period of the chosen semester.
      else {
        return months.slice(months.indexOf(this.state.selected.end) +1, i +1).map((m) => document.getElementById(m));
      }
    }

    // No actionable months for this action.
    return [];
  }

  // Returns a list of what months are available for booking in the current period.
  // If extras is true, it will append extra months to that list according to their availability given by the typology selection.
  availableMonths(extras) {
    if (!this.state || !this.state.period) {
      return [];
    }

    let startMonth = this.state.period.periodStartMonth.split("-").map(function(x) { return parseInt(x, 10); });
    let endMonth = this.state.period.periodEndMonth.split("-").map(function(x) { return parseInt(x, 10); });

    let start = startMonth.slice();
    let end = endMonth.slice();

    // Add extra months before and after the period.
    if (extras) {
      const typology = this.state.typologyPeriod || this.state.period;
      typology.monthsBefore = typology.monthsBefore || 0;
      typology.monthsAfter = typology.monthsAfter || 0;

      if (typology.monthsBefore) {
        for (let i = 0; i < typology.monthsBefore; i++) {
          this.loopMonth(start, true);
        }
      }
      if (typology.monthsAfter) {
        for (let i = 0; i < typology.monthsAfter; i++) {
          this.loopMonth(end);
        }
      }
    }

    // Add all the months to be shown.
    let current = start.slice();
    const months = [];
    while (true) {
      months.push(current.join("-"));
      if (current[0] === end[0] && current[1] === end[1]) {
        break;
      }
      this.loopMonth(current);
    }
    return months;
  }

  // Goes back or forward a month relative to the given month.
  loopMonth(month, backward) {
    if (backward) {
      month[0]--;
      if (month[0] < 1) {
        month[0] = 12;
        month[1]--;
      }
    }
    else {
      month[0]++;
      if (month[0] > 12) {
        month[0] = 1;
        month[1]++;
      }
    }
  }

  // Render functions, everything related to actually showing the widget on the page.

  renderMonth(month, period) {
    let className = "datepicker-month";
    if(period.indexOf(month) > -1) {
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
    const months = this.availableMonths(true);
    const period = this.availableMonths();

    return (
      <div className="datepicker">
        <div className="datepicker-months">
          {months.map((month) => this.renderMonth(month, period))}
        </div>
      </div>
    );
  }
}

export default DatePicker;
