import React, { Component } from "react";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import EventDate from "../common/Event/EventDate";
import EventCreator from "./EventCreator";

class EventCard extends Component {
  render() {
    const { event } = this.props;
    const {
      id,
      eventname,
      desires,
      startTime,
      address,
      participants,
      distance,
      ownerProfile,
      image
    } = event;

    return (
      <div className="col-md-12 col-lg-6" key={id}>
        <div className="card-item">
          <div className="thumbnail">
            <EventDate time={startTime} />
            <EventCreator ownerProfile={ownerProfile} />
            <a
              href={null}
              onClick={() => this.props.history.push("/events/" + id)}
            >
              <img
                src={
                  image !== "" && image !== undefined && image !== null
                    ? image
                    : "assets/img/events/1001@2x.png"
                }
                alt=""
              />
            </a>
          </div>
          <div className="content">
            <div className="event-name">
              <a
                href={null}
                onClick={() => this.props.history.push("/events/" + id)}
              >
                {eventname}
              </a>
            </div>
            <span className="distance">{distance} mil away</span>
            <div className="goings">
              <ul>
                <li>
                  <img src="assets/img/usr/avatar/1001@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1002@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1003@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1004@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1005@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1006@2x.png" alt="" />
                </li>
              </ul>
              <span className="stats">
                <b>{participants.length} people</b> going
              </span>
            </div>
            <div className="functions">
              <div className="btn go-detail">
                <a
                  href={null}
                  onClick={() => this.props.history.push("/events/" + id)}
                >
                  Event Detail
                </a>
              </div>
              <div className="btn share">
                <a href="#" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(EventCard);
