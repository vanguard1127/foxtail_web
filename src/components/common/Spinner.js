import React, { PureComponent } from "react";
import { EventLoader, ProfileLoader, InboxLoader } from "../common/Skeletons";

class Spinner extends PureComponent {
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
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <section className="loading">
          <div className="container">
            <div className="col-md-12">
              <div className="content">
                <div className="bar">
                  <div className="lo-bar">
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
                <div className="lo-text">
                  {" "}
                  <ProfileLoader />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  }
}
export default Spinner;
