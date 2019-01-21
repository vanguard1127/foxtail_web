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
    this.setState({
      startDate: date
    });
  };

  render() {
    const { t, name, onChange } = this.props;
    const { startDate } = this.state;

    let date = new Date();

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
          minDate={date}
          shouldCloseOnSelect={false}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="MMMM d, yyyy h:mm aa"
          timeCaption="time"
        />
      </div>
    );
  }
}
