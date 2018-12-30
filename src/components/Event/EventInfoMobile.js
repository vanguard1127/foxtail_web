import React from "react";
import EventHeading from "./EventHeading";
import EventDate from "../common/EventDate";
import EventCreator from "./EventCreator";
import EventShare from "./EventShare";

const EventInfoMobile = ({
  event: { id, startTime, eventname, ownerProfile, createdAt, image }
}) => {
  return (
    <div className="event-info-content hid-desktop">
      <div className="event-image">
        <a href="assets/img/events/1001@2x.png">
          <img
            src={image !== "" ? image : "/assets/img/events/1001@2x.png"}
            alt=""
          />
        </a>
      </div>
      <ul>
        <li>
          <span className="head">Event Date:</span>
          <span className="title">22 December 2018, Monday</span>
        </li>
        <li>
          <span className="head">Event Time:</span>
          <span className="title">20:00 - 24:00</span>
        </li>
        <li>
          <span className="head">Type:</span>
          <span className="title">Public</span>
        </li>
        <li>
          <span className="head">Interested:</span>
          <span className="title">Flirting, Dating</span>
        </li>
        <li>
          <span className="head">What to Expect:</span>
          <span className="title">Expect</span>
        </li>
        <li>
          <span className="head">Away:</span>
          <span className="title">12.50 Miles</span>
        </li>
        <li>
          <span className="head">Address:</span>
          <span className="title address">
            Elixir Saloon
            <p>3200 16th St, San Francisco, CA 94103United States</p>
          </span>
        </li>
      </ul>
      <div className="join-event">
        <a href="#">I'm Going</a>
      </div>
    </div>
  );
};

export default EventInfoMobile;
