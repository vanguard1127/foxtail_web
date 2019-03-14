import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import EventDate from '../common/Event/EventDate';
import EventCreator from './EventCreator';

class EventCard extends PureComponent {
  render() {
    const { event, t } = this.props;
    const {
      id,
      eventname,
      startTime,
      participants,
      distance,
      ownerProfile,
      image
    } = event;

    return (
      <div className="col-md-12 col-lg-6" key={id}>
        <div className="card-item">
          <div className="thumbnail">
            <EventDate time={startTime} />
            <EventCreator ownerProfile={ownerProfile} />
            <span onClick={() => this.props.history.push('/event/' + id)}>
              <img
                src={
                  image !== '' && image !== undefined && image !== null
                    ? image
                    : 'assets/img/events/1001@2x.png'
                }
                alt=""
              />
            </span>
          </div>
          <div className="content">
            <div className="event-name">
              <span onClick={() => this.props.history.push('/event/' + id)}>
                {eventname}
              </span>
            </div>
            <span className="distance">
              {distance} {t('common:' + 'miaway')}
            </span>
            <div className="goings">
              <ul>
                <li>
                  <img src="assets/img/usr/avatar/1001@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1002@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1003@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1004@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1005@2x.png" alt="" />
                </li>
                <li>
                  <img src="assets/img/usr/avatar/1006@2x.png" alt="" />
                </li>
              </ul>
              <span className="stats">
                <b>
                  {participants.length} {t('common:people')}
                </b>{' '}
                {t('common:going')}
              </span>
            </div>
            <div className="functions">
              <div
                className="btn go-detail"
                onClick={() => this.props.history.push('/event/' + id)}
              >
                <span>{t('eventdetail')}</span>
              </div>
              <div className="btn share">
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(EventCard);
