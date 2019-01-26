import React, { Component, Fragment } from "react";
// First way to import
import { PacmanLoader } from "react-spinners";
import { EventLoader, ProfileLoader, InboxLoader } from "../common/Skeletons";

class Spinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMessage: false,
      loading: true
    };
    this.enableMessage = this.enableMessage.bind(this);

    this.timer = setTimeout(this.enableMessage, 250);
  }

  enableMessage() {
    this.setState({ displayMessage: true });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { page, title } = this.props;
    const { displayMessage } = this.state;

    if (!displayMessage) {
      return null;
    }
    if (page === "searchProfiles") {
      return (
        <section className="members">
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <span className="head">{title}</span>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className={"card-item "}>
                    <ProfileLoader />
                  </div>
                </div>{" "}
                <div className="col-md-6 col-lg-4">
                  <div className={"card-item "}>
                    <ProfileLoader />
                  </div>
                </div>{" "}
                <div className="col-md-6 col-lg-4">
                  <div className={"card-item "}>
                    <ProfileLoader />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    } else if (page === "inbox") {
      return (
        <div className="conversations">
          <div className="item unread" key={"1"}>
            <InboxLoader />
          </div>
          <div className="item unread" key={"2"}>
            <InboxLoader />
          </div>
        </div>
      );
    } else if (page === "searchEvents") {
      return (
        <div className="events-card-content">
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <span className="head">{title}</span>
                </div>
                <div className="col-md-12 col-lg-6" key={"1"}>
                  <div className="card-item">
                    <EventLoader />
                  </div>
                </div>{" "}
                <div className="col-md-12 col-lg-6" key={"2"}>
                  <div className="card-item">
                    <EventLoader />
                  </div>
                </div>{" "}
                <div className="col-md-12 col-lg-6" key={"3"}>
                  <div className="card-item">
                    <EventLoader />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="sweet-loading"
          style={{
            display: "flex",
            flex: "1",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <PacmanLoader
            sizeUnit={"px"}
            size={15}
            color={"#5F00A4"}
            loading={this.state.loading}
          />
          <br />
          <div style={{ marginLeft: "4vw" }}>{this.props.message}</div>
        </div>
      );
    }
  }
}
export default Spinner;
