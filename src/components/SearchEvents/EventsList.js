import React, { Component } from "react";
import EventCard from "./EventCard";
import { Waypoint } from "react-waypoint";

class EventsList extends Component {
  shouldComponentUpdate(nextProps) {
    //TODO: Compare better see if it breaks waypoint
    const { events } = this.props;
    if (events !== nextProps.events) return true;
    return false;
  }

  render() {
    const { events, handleEnd, t, dayjs } = this.props;
    return (
      <div className="events-card-content">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <span className="head">{t("upcomingevent")}</span>
              </div>
              {events.map(event => (
                <EventCard
                  upcomingEvents
                  key={Math.random()}
                  event={event}
                  t={t}
                  dayjs={dayjs}
                />
              ))}
              <Waypoint
                onEnter={({ previousPosition }) => handleEnd(previousPosition)}
              />
              <div className="col-md-12">
                <div className="more-content-btn">
                  <span>{t("noevent")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventsList;
