import React, { Component } from "react";
import GoingBar from "./GoingBar";

class EventAbout extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.isOwner !== nextProps.isOwner ||
      this.props.participants !== nextProps.participants ||
      this.props.description !== nextProps.description
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      id,
      participants,
      description,
      isOwner,
      t,
      ErrorHandler,
      ReactGA
    } = this.props;
    return (
      <ErrorHandler.ErrorBoundary>
        <div className="about-event-content">
          <p>{description}</p>
          <GoingBar
            id={id}
            participants={participants}
            t={t}
            isOwner={isOwner}
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
          />
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default EventAbout;
