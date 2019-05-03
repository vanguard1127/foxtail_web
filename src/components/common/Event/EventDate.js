import React, { PureComponent } from "react";

class EventDate extends PureComponent {
  render() {
    const { time, dayjs } = this.props;
    return (
      <div className="date">
        <span>
          {" "}
          {dayjs(time)
            .locale(localStorage.getItem("i18nextLng"))
            .format("D")}{" "}
        </span>
        <span>
          {dayjs(time)
            .locale(localStorage.getItem("i18nextLng"))
            .format("MMM")}{" "}
        </span>
        <span>
          {" "}
          {dayjs(time)
            .locale(localStorage.getItem("i18nextLng"))
            .format("HH:mm")}{" "}
        </span>
      </div>
    );
  }
}

export default EventDate;
