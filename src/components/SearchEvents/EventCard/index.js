import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import milesToKilometers from "../../../utils/distanceMetric";
import EventDate from "../../common/Event/EventDate";
import EventCreator from "./EventCreator";
const NoEventImg = require("../../../assets/img/events/no-image.png");

class EventCard extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }

  onEventClick = () => {
    const { history, event } = this.props;
    const { id } = event;
    history.push("/event/" + id);
  };

  render() {
    const {
      event,
      t,
      dayjs,
      upcomingEvents,
      distanceMetric,
      lang
    } = this.props;
    const {
      eventname,
      startTime,
      participants,
      distance,
      ownerProfile,
      image
    } = event;

    return (
      <div className={upcomingEvents ? "col-md-12 col-lg-6" : "col-md-12"}>
        <div className="card-item">
          <div className="thumbnail" onClick={this.onEventClick}>
            <EventDate time={startTime} dayjs={dayjs} lang={lang} />
            <EventCreator ownerProfile={ownerProfile} />
            <span onClick={this.onEventClick}>
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
              <span onClick={this.onEventClick}>{eventname}</span>
            </div>
            <span className="distance">
              {milesToKilometers(distance, distanceMetric)}{" "}
              {t("common:" + (distanceMetric === "mi" ? "miaway" : "kmaway"))}
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
              <div className="btn go-detail" onClick={this.onEventClick}>
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
