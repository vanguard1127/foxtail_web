import React, { PureComponent } from "react";

class EventDate extends PureComponent {
  render() {
    const { time, dayjs, lang } = this.props;
    return (
      <div className="date">
        <span>
          {" "}
          {dayjs(time)
            .locale(lang)
            .format("D")}{" "}
        </span>
        <span>
          {dayjs(time)
            .locale(lang)
            .format("MMM")}{" "}
        </span>
        <span>
          {" "}
          {dayjs(time)
            .locale(lang)
            .format("HH:mm")}{" "}
        </span>
      </div>
    );
  }
}

export default EventDate;
