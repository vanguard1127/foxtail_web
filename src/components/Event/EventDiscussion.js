import React from 'react';
import ChatPanel from './ChatPanel';
import ChatContent from './ChatContent';
const EventDiscussion = ({ id, chatID, history, t, ErrorHandler }) => {
  return (
    <div className="discuss-content">
      <span className="head">{t('discuss')}</span>
      <ChatPanel chatID={chatID} t={t} ErrorHandler={ErrorHandler} />
      <ChatContent
        chatID={chatID}
        history={history}
        t={t}
        ErrorHandler={ErrorHandler}
      />
    </div>
  );
};

export default EventDiscussion;
