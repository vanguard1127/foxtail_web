import React from "react";
import Linkify from "react-linkify";

import GoingBar from "./GoingBar";

interface IEventAboutProps {
  id: string;
  participants: any;
  description: string;
  isOwner: boolean;
  t: any;
  ErrorHandler: any;
  ReactGA: any;
}

const EventAbout: React.FC<IEventAboutProps> = ({
  id,
  participants,
  description,
  isOwner,
  t,
  ErrorHandler,
  ReactGA
}) => {
  const componentDecorator = (href, text, key) => (
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

  return (
    <ErrorHandler.ErrorBoundary>
      <div className="about-event-content">
        <p>
          <Linkify componentDecorator={componentDecorator}>
            {description}
          </Linkify>
        </p>
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
};

export default EventAbout;
