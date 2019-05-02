import React, { Component } from "react";
import ScrollUpButton from "react-scroll-up-button";
import EventCard from "./EventCard/";
import { Waypoint } from "react-waypoint";

class EventsList extends Component {
  shouldComponentUpdate(nextProps) {
    const { events, loading } = this.props;
    if (events !== nextProps.events || loading !== nextProps.loading) {
      return true;
    }
    return false;
  }

  render() {
    const { events, handleEnd, t, dayjs, distanceMetric } = this.props;
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
                  distanceMetric={distanceMetric}
                />
              ))}
              <ScrollUpButton />
              <div className="col-md-12">
                <div className="more-content-btn">
                  {this.props.loading ? (
                    <span>{t("Loading")}</span>
                  ) : (
                    <span>{t("noevent")}</span>
                  )}
                </div>
              </div>
            </div>
            <div
              style={{ padding: "0px", position: "absolute", bottom: "30%" }}
            >
              <Waypoint
                onEnter={({ previousPosition }) => handleEnd(previousPosition)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventsList;
