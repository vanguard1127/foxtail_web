import React, { PureComponent } from 'react';
import AttendEvent from './AttendEvent';
import EditEventBtn from './EditEventBtn';

//TODO: Fix this
class EventInfoMobile extends PureComponent {
  render() {
    const { event, t, ErrorHandler, isOwner, openDelete, dayjs } = this.props;

    const {
      id,
      startTime,
      endTime,
      type,
      desires,
      distance,
      address,
      participants
    } = event;
    return (
      <div className="event-info-content hid-desktop">
        <div className="event-image">
          <span>
            <img src="/assets/img/events/1001@2x.png" alt="" />
          </span>
        </div>
        <ul>
          <li>
            <span className="head">{t('evedate')}:</span>
            <span className="title">
              {dayjs(startTime)
                .locale(localStorage.getItem('i18nextLng'))
                .format('DD MMMM YYYY, dddd')
                .toString()}
            </span>
          </li>
          <li>
            <span className="head">
              {t('evedate')} - {t('time')}:
            </span>
            <span className="title">
              {dayjs(startTime)
                .locale(localStorage.getItem('i18nextLng'))
                .format('HH:mm')
                .toString()}{' '}
              -{' '}
              {dayjs(endTime)
                .locale(localStorage.getItem('i18nextLng'))
                .format('HH:mm')
                .toString()}
            </span>
          </li>
          <li>
            <span className="head">{t('Type')}:</span>
            <span className="title">{type}</span>
          </li>
          <li>
            <span className="head">{t('toexpect')}:</span>
            <span className="title">{desires.map(desire => desire + ',')}</span>
          </li>
          <li>
            <span className="head">{t('Away')}:</span>
            <span className="title">{distance} Miles</span>
          </li>
          <li>
            <span className="head">{t('common:Address')}:</span>
            <span className="title address">{address}</span>
          </li>
        </ul>
        {!isOwner ? (
          <AttendEvent
            id={id}
            participants={participants}
            t={t}
            ErrorHandler={ErrorHandler}
          />
        ) : (
          <>
            <EditEventBtn
              id={id}
              t={t}
              ErrorHandler={ErrorHandler}
              updateEventProps={event}
            />
            <div className="join-event">
              <span onClick={() => openDelete()}>Cancel Event</span>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default EventInfoMobile;
