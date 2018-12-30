import React from "react";
import moment from "moment";
const EventDate = ({ time }) => {
  return (
    <div className="date">
      <span> {moment(time).format("D")} </span>
      <span>{moment(time).format("MMM")} </span>
      <span> {moment(time).format("HH:mm")} </span>
    </div>
  );
};

export default EventDate;
