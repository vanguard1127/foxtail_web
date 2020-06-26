import React from "react";
import { WithT } from "i18next";
import ScrollUpButton from "react-scroll-up-button";
import EventCard from "./EventCard";
import { Waypoint } from "react-waypoint";

interface IEventsList extends WithT {
  events: any;
  handleEnd: any;
  dayjs: any;
  lang: string;
  distanceMetric: string;
  loading: boolean;
}

const EventsList: React.FC<IEventsList> = ({
  events,
  handleEnd,
  dayjs,
  lang,
  distanceMetric,
  loading,
  t
}) => {
  return (
    <div className="events-card-content">
      <div className="container">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <span className="head">{t("upcomingevent")}</span>
            </div>
            {events.map((event) => (
              <EventCard
                upcomingEvents
                key={Math.random()}
                event={event}
                t={t}
                dayjs={dayjs}
                distanceMetric={distanceMetric}
                lang={lang}
              />
            ))}
            <ScrollUpButton />
            <div className="col-md-12">
              <div className="more-content-btn">
                {loading ? (
                  <span>{t("Loading")}</span>
                ) : (
                  <span>{t("noevent")}</span>
                )}
              </div>
            </div>
          </div>
          <div style={{ padding: "0px", position: "absolute", bottom: "30%" }}>
            <Waypoint
              onEnter={({ previousPosition, currentPosition }) =>
                handleEnd({ previousPosition, currentPosition })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsList;
