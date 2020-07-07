import React from "react";
import Linkify from "react-linkify";
import { WithT } from "i18next";

import * as ErrorHandler from "components/common/ErrorHandler";

import GoingBar from "./GoingBar";

interface IEventAboutProps extends WithT {
  id: string;
  participants: any;
  description: string;
  isOwner: boolean;
}

const EventAbout: React.FC<IEventAboutProps> = ({
  id,
  participants,
  description,
  isOwner,
  t,
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
        />
      </div>
    </ErrorHandler.ErrorBoundary>
  );
};

export default EventAbout;
