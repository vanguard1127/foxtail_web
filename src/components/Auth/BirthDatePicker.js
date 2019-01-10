import React, { Component } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import MomentLocaleUtils, {
  formatDate,
  parseDate
} from "react-day-picker/moment";
import "react-day-picker/lib/style.css";
import moment from "moment";

//TODO: Add select year and month to day picker
const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear + 10, 11);

function YearMonthForm({ date, localeUtils, onChange }) {
  const months = localeUtils.getMonths();

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <form className="DayPicker-Caption">
      <select name="month" onChange={handleChange} value={date.getMonth()}>
        {months.map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </select>
      <select name="year" onChange={handleChange} value={date.getFullYear()}>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </form>
  );
}
export default class BirthDatePicker extends Component {
  constructor(props) {
    super(props);
    this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
    this.state = {
      month: fromMonth
    };
  }
  handleYearMonthChange(month) {
    this.setState({ month });
  }
  render() {
    return (
      <div className="YearNavigation">
        <DayPickerInput
          {...this.props}
          onDayChange={(selectedDay, modifiers, dayPickerInput) => {
            this.props.onChange({
              target: {
                ...dayPickerInput.getInput(),
                name: this.props.name,
                id: this.props.name
              }
            });
          }}
          classNames={{
            container: "input datepicker",
            overlay: "DayPickerInput-Overlay"
          }}
          captionElement={({ date, localeUtils }) => (
            <YearMonthForm
              date={date}
              localeUtils={localeUtils}
              onChange={this.handleYearMonthChange}
            />
          )}
          dayPickerProps={{
            month: moment()
              .endOf("day")
              .subtract(18, "years")._d,
            toMonth: moment()
              .endOf("day")
              .subtract(18, "years")._d,
            disabledDays: [
              {
                after: moment()
                  .endOf("day")
                  .subtract(18, "years")._d
              }
            ],
            locale: "en",
            localeUtils: MomentLocaleUtils
          }}
          formatDate={formatDate}
          parseDate={parseDate}
          format="L"
          placeholder={`Birthday`}
        />
      </div>
    );
  }
}
