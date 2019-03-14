import React, { PureComponent } from 'react';
import EventTitles from './EventTitles';
import EventDate from '../common/Event/EventDate';
import EventCreator from './EventCreator';
import EventShare from './EventShare';

class EventHeader extends PureComponent {
  render() {
    const {
      event: { id, startTime, eventname, ownerProfile, createdAt, tagline },
      history,
      t
    } = this.props;

    return (
      <div className="header">
        <EventDate time={startTime} />
        <div className="info">
          <EventTitles eventname={eventname} tagline={tagline} />
          <EventCreator
            ownerProfile={ownerProfile}
            createdAt={createdAt}
            history={history}
            t={t}
          />
          <EventShare id={id} t={t} />
        </div>
      </div>
    );
  }
}

export default EventHeader;
