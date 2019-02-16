import React from 'react';
import EventHeading from './EventTitles';
import EventDate from '../common/Event/EventDate';
import EventCreator from './EventCreator';
import EventShare from './EventShare';

//TODO: Fix this
const EventInfoMobile = ({
  event: { id, startTime, eventname, ownerProfile, createdAt, image },
  t
}) => {
  return (
    <div className="event-info-content hid-desktop">
      <div className="event-image">
        <a href="assets/img/events/1001@2x.png">
          <img
            src={image !== '' ? image : '/assets/img/events/1001@2x.png'}
            alt=""
          />
        </a>
      </div>
      <ul>
        <li>
          <span className="head">{t('evedate')}:</span>
          <span className="title">22 December 2018, Monday</span>
        </li>
        <li>
          <span className="head">{t('evetime')}:</span>
          <span className="title">20:00 - 24:00</span>
        </li>
        <li>
          <span className="head">{t('Type')}:</span>
          <span className="title">Public</span>
        </li>
        <li>
          <span className="head">{t('Interested')}:</span>
          <span className="title">Flirting, Dating</span>
        </li>
        <li>
          <span className="head">{t('toexpect')}:</span>
          <span className="title">Expect</span>
        </li>
        <li>
          <span className="head">{t('Away')}:</span>
          <span className="title">12.50 Miles</span>
        </li>
        <li>
          <span className="head">{t('common:Address')}:</span>
          <span className="title address">
            <p>3200 16th St, San Francisco, CA 94103United States</p>
          </span>
        </li>
      </ul>
      <div className="join-event">
        <span>{t('imGoing')}</span>
      </div>
    </div>
  );
};

export default EventInfoMobile;
