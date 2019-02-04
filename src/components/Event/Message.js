import React from 'react';
import moment from 'moment';

const Message = React.forwardRef(({ message, history }, ref) => {
  const messageText = message.text;
  return (
    <div className="item" ref={ref}>
      <span className="avatar">
        <span onClick={() => history.push('/member/' + message.fromUser.id)}>
          <img
            src={
              message.profilePic !== ''
                ? message.profilePic
                : '/assets/img/usr/avatar/1001@2x.png'
            }
            alt=""
          />
        </span>
      </span>
      <div className="info">
        <span className="name">
          <span onClick={() => history.push('/member/' + message.fromUser.id)}>
            {' '}
            {message.fromUser.username}
          </span>
        </span>
        <span className="date">
          {' '}
          {moment(message.createdAt)
            .format('MMMM D, YYYY - HH:mm')
            .toString()}
        </span>

        <span className="msg">{messageText}</span>
      </div>
    </div>
  );
});

export default Message;
