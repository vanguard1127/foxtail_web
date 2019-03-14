import React, { PureComponent } from 'react';
import GoingBar from './GoingBar';

class EventAbout extends PureComponent {
  render() {
    const { id, participants, description, isOwner, t } = this.props;
    return (
      <div className="about-event-content">
        <p>{description}</p>
        <GoingBar id={id} participants={participants} t={t} isOwner={isOwner} />
      </div>
    );
  }
}

export default EventAbout;
