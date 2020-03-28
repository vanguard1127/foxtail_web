import React, { Component } from "react";
import GoingBar from "./GoingBar";
import Linkify from "react-linkify";

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
    componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer nofollow"
      style={{ textDecoration: "underline" }}
    >
      {text}
    </a>
  );
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
          <p>        <Linkify componentDecorator={this.componentDecorator}>
              {description}
            </Linkify></p>
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
