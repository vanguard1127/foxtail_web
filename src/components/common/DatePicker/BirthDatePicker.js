import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

export default class BirthDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null
    };
  }

  handleChange = date => {
    this.setState(
      {
        startDate: date
      },
      () => this.props.onChange(date)
    );
  };

  render() {
    const { t } = this.props;
    const { startDate } = this.state;

    let date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return (
      <div className="input calender">
        <DatePicker
          placeholderText="Birthdate"
          selected={startDate}
          onChange={this.handleChange}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          maxDate={date}
        />
      </div>
    );
  }
}
