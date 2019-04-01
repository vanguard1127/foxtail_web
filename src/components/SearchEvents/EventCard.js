import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import EventDate from "../common/Event/EventDate";
import EventCreator from "./EventCreator";

class EventCard extends Component {
  shouldComponentUpdate() {
    return false;
  }

  onEventClick = id => {
    const { history } = this.props;
    history.push("/event/" + id);
  };

  render() {
    const { event, t, dayjs } = this.props;
    const {
      id,
      eventname,
      startTime,
      participants,
      distance,
      ownerProfile,
      image
    } = event;

    return (
      <div className="col-md-12">
        <div className="card-item">
          <div className="thumbnail" onClick={() => this.onEventClick(id)}>
            <EventDate time={startTime} dayjs={dayjs} />
            <EventCreator ownerProfile={ownerProfile} />
            <span>
              <img
                src={
                  image !== "" && image !== undefined && image !== null
                    ? image
                    : "assets/img/events/1001@2x.png"
                }
                alt=""
              />
            </span>
          </div>
          <div className="content">
            <div className="event-name">
              <span onClick={() => this.onEventClick(id)}>{eventname}</span>
            </div>
            <span className="distance">
              {distance} {t("common:" + "miaway")}
            </span>
            <div className="goings">
              <ul>
                {participants.map(el => (
                  <li key={Math.random()}>
                    <img src={el.profilePic} alt="" />
                  </li>
                ))}
              </ul>
              <span className="stats">
                <b>
                  {participants.length} {t("common:people")}
                </b>{" "}
                {t("common:going")}
              </span>
            </div>
            <div className="functions">
              <div
                className="btn go-detail"
                onClick={() => this.onEventClick(id)}
              >
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
  }
}

export default withRouter(EventCard);
