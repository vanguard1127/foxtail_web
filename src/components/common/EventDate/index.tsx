import React from "react";
import dayjs from 'dayjs';

interface IEventDate {
  time: any;
  lang: string;
}

const EventDate: React.FC<IEventDate> = ({
  time,
  lang,
}) => {
  return (
    <div className="date">
      <span>
        {` ${dayjs(time).locale(lang).format("D")} `}
      </span>
      <span>
        {`${dayjs(time).locale(lang).format("MMM")} `}</span>
      <span>
        {` ${dayjs(time).locale(lang).format("HH:mm")} `}
      </span>
    </div>
  );
}

export default EventDate;
