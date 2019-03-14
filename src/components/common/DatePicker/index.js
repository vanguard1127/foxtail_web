import React, { PureComponent } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import fi from 'date-fns/locale/fi';
import './DatePicker.css';
registerLocale('fi', fi);

export default class CustomDatePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: this.props.value || null
    };
  }

  handleChange = date => {
    this.setState(
      {
        selectedDate: date
      },
      () => this.props.onChange(date)
    );
  };

  render() {
    const { t, type, placeholder, p } = this.props;
    const { selectedDate } = this.state;
    if (type === 'birthday') {
      let date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      return (
        <div className="input calender calender-input-sm">
          <DatePicker
            placeholderText={t('Birthday')}
            selected={selectedDate}
            onChange={this.handleChange}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            maxDate={date}
            locale="fi"
          />
        </div>
      );
    } else if (type === 'datetime') {
      let date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      return (
        <div className="input calender calender-input-sm">
          <DatePicker
            placeholderText={placeholder}
            selected={selectedDate && new Date(selectedDate)}
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
            {...p}
          />
        </div>
      );
    }
    return null;
  }
}
