import React from "react";
import moment from "moment";
import AttendEvent from "./AttendEvent";

const EventInfo = ({
  event: {
    id,
    startTime,
    endTime,
    type,
    desires,
    distance,
    address,
    participants
  },
  t
}) => {
  return (
    <div className="event-info-content hid-mobile">
      <div className="event-image">
        <a href="assets/img/events/1001@2x.png">
          <img src="/assets/img/events/1001@2x.png" alt="" />
        </a>
      </div>
      <ul>
        <li>
          <span className="head">{t("evedate")}:</span>
          <span className="title">
            {moment(startTime)
              .format("DD MMMM YYYY, dddd")
              .toString()}
          </span>
        </li>
        <li>
          <span className="head">
            {t("evedate")} - {t("time")}:
          </span>
          <span className="title">
            {moment(startTime)
              .format("HH:mm")
              .toString()}{" "}
            -{" "}
            {moment(endTime)
              .format("HH:mm")
              .toString()}
          </span>
        </li>
        <li>
          <span className="head">{t("Type")}:</span>
          <span className="title">{type}</span>
        </li>
        <li>
          <span className="head">{t("toexpect")}:</span>
          <span className="title">{desires.map(desire => desire + ",")}</span>
        </li>
        <li>
          <span className="head">{t("Away")}:</span>
          <span className="title">{distance} Miles</span>
        </li>
        <li>
          <span className="head">{t("common:Address")}:</span>
          <span className="title address">{address}</span>
        </li>
      </ul>
      <AttendEvent id={id} participants={participants} t={t} />
    </div>
  );
};

export default EventInfo;
