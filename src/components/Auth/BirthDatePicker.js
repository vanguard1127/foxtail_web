import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

export default class BirthDatePicker extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }
  handleChange = value => {
    this.props.onChange(this.props.id, value);
  };

  handleBlur = () => {
    this.props.onBlur(this.props.id, true);
  };

  render() {
    return (
      <DatePicker
        // autoComplete="off"
        // id={this.props.id}
        // maxDate={this.props.maxDate || null}
        // selected={
        //   typeof this.props.value === "string"
        //     ? moment(this.props.value)
        //     : this.props.value
        // }
        // onBlur={this.handleBlur}
        // dateFormat="DD/MM/YYYY"
        // onChange={this.handleChange}
        // showYearDropdown
        // dateFormatCalendar="MMMM"
        // scrollableYearDropdown
        // disabled={this.props.disabled}
        // yearDropdownItemNumber={15}
        className="input birthday"
        placeholderText="Birthday"
      />
    );
  }
}
