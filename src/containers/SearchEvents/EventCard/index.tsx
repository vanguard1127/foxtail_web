import React from "react";
import { WithT } from "i18next";
import { withRouter, RouteComponentProps } from "react-router-dom";

import EventDate from "components/common/EventDate";
import NoEventImg from "assets/img/elements/no-eve-image.jpg";

import EventCreator from "./EventCreator";

interface IEventCard extends WithT, RouteComponentProps {
  lang: string;
  event: any;
  upcomingEvents?: boolean;
  distanceMetric: string;
  history: any;
}

const EventCard: React.FC<IEventCard> = ({
  event,
  t,
  upcomingEvents,
  distanceMetric,
  lang,
  history
}) => {
  const {
    eventname,
    startTime,
    participants,
    distance,
    ownerProfile,
    image,
    id
  } = event;

  const onEventClick = () => {
    history.push("/event/" + id);
  };

  return (
    <div className={upcomingEvents ? "col-md-12 col-lg-6" : "col-md-12"}>
      <div className="card-item">
        <div className="thumbnail" onClick={onEventClick}>
          <EventDate time={startTime} lang={lang} />
          <EventCreator ownerProfile={ownerProfile} />
          <span onClick={onEventClick}>
            <img
              src={
                image !== "" && image !== undefined && image !== null
                  ? image
                  : NoEventImg
              }
              alt=""
            />
          </span>
        </div>
        <div className="content">
          <div className="event-name">
            <span onClick={onEventClick}>{eventname}</span>
          </div>
          <span className="distance">
            {distance}{" "}
            {t("common:" + (distanceMetric === "mi" ? "miaway" : "kmaway"))}
          </span>
          <div className="goings">
            <ul>
              {participants.map((el) => (
                <li key={Math.random()}>
                  <img src={el.profilePic} alt="" />
                </li>
              ))}
            </ul>
            <span className="stats">
              <b>
                {participants.length} {t("common:people")}{" "}
              </b>
              {t("common:going")}
            </span>
          </div>
          <div className="functions">
            <div className="btn go-detail" onClick={onEventClick}>
              <span>{t("eventdetail")}</span>
            </div>
            <div className="btn share">
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(EventCard);
