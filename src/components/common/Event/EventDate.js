import React, { PureComponent } from 'react';
import moment from 'moment';

class EventDate extends PureComponent {
  render() {
    const { time } = this.props;
    return (
      <div className="date">
        <span>
          {' '}
          {moment(time)
            .locale(localStorage.getItem('i18nextLng'))
            .format('D')}{' '}
        </span>
        <span>
          {moment(time)
            .locale(localStorage.getItem('i18nextLng'))
            .format('MMM')}{' '}
        </span>
        <span>
          {' '}
          {moment(time)
            .locale(localStorage.getItem('i18nextLng'))
            .format('HH:mm')}{' '}
        </span>
      </div>
    );
  }
}

export default EventDate;
