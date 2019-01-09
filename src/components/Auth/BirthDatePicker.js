import React, { Component } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";

import "react-day-picker/lib/style.css";

export default class BirthDatePicker extends Component {

  render() {
    return (
      <DayPickerInput
        {...this.props}
        classNames={{
          container: "input datepicker",
          overlay: "DayPickerInput-Overlay"
        }}
      />
    );
  }
}
