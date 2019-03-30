import React, { Component } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from "date-fns/locale/fi";
import "./DatePicker.css";
registerLocale("fi", fi);

export default class CustomDatePicker extends Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      selectedDate: value || null
    };
  }

  handleChange = date => {
    const { onChange } = this.props;
    this.setState(
      {
        selectedDate: date
      },
      () => onChange(date)
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { value } = this.props;
    if (nextProps.value !== value) return true;
    else return false;
  }

  render() {
    const { t, type, placeholder, p } = this.props;
    const { selectedDate } = this.state;

    let date = new Date();
    date.setFullYear(date.getFullYear() - 18);

    if (type === "birthday") {
      return (
        <div className="input calender calender-input-sm">
          <DatePicker
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            placeholderText={t("Birthday")}
            selected={selectedDate}
            onChange={this.handleChange}
            dropdownMode="select"
            maxDate={date}
            locale="fi"
          />
        </div>
      );
    } else if (type === "datetime") {
      return (
        <div className="input calender calender-input-sm">
          <DatePicker
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            showTimeSelect
            placeholderText={placeholder}
            selected={selectedDate && new Date(selectedDate)}
            onChange={this.handleChange}
            dropdownMode="select"
            minDate={date}
            shouldCloseOnSelect={false}
            timeFormat="HH:mm"
            dateFormat="MMMM d, yyyy h:mm aa"
            timeCaption="time"
            {...p}
          />
        </div>
      );
    }
    return null;
  }
}
