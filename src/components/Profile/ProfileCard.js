import React, { Component } from "react";
import ImageCarousel from "./ImageCarousel";
import NamePlate from "./NamePlate";
import DesiresList from "../Desire/DesiresList";

class ProfileCard extends Component {
  state = {};

  render() {
    const { users, desires, about, id } = this.props.profile;
    return (
      <div
        style={{
          width: "400px",
          display: "inline-block",
          border: "2px solid #eee",
          borderRadius: "5px",
          margin: "20px"
        }}
        key={id}
      >
        <ImageCarousel />
        <div>
          <div style={{ width: "50%", height: "5em", display: "inline-block" }}>
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  <NamePlate user={user} />
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{ width: "50%", display: "inline-block", float: "right" }}
          >
            {" "}
            <button>Chat</button>
            <button>Like</button>
          </div>
        </div>
        Desires: <DesiresList desires={desires} />
        Bio:
        <div>{about}</div>
        <ul>
          <li>
            <button>Like</button>
          </li>
          <li>
            {" "}
            <button>Send Message</button>
          </li>
          <li>
            {" "}
            <button>Share (if not private)</button>
          </li>
          <li>
            {" "}
            <button>Block & Report</button>
          </li>
        </ul>
      </div>
    );
  }
}

export default ProfileCard;
