import React, { Component } from "react";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";

class EventCard extends Component {
  render() {
    const { event } = this.props;
    const { id, eventname, desires, time, address, participants } = event;

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td colSpan="3">
                <div
                  style={{
                    backgroundImage:
                      "url(" + require("../../images/party.jpg") + ")",
                    backgroundSize: "cover",
                    height: "25vh",
                    width: "40vw"
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ float: "left" }}>
                  {moment(time).format("hh:mm a")}
                </div>
              </td>
              <td>
                <div style={{ display: "block" }}>
                  <Link to={`/events/${id}`}>{eventname}</Link>
                  <br />
                  {address}
                  <br />
                  {"What to Expect: " + desires.map(desire => desire)}
                  <br />
                  {participants ? participants.length : "0"} attending
                </div>
              </td>
              <td>
                <div>
                  <button
                    onClick={() => this.props.history.push(`/events/${id}`)}
                  >
                    Open
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => this.props.showBlockModal(true, event)}
                  >
                    Flag
                  </button>
                  <button
                    onClick={() => this.props.showShareModal(true, event)}
                  >
                    Share
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(EventCard);
