import React from 'react';
const ChatInfo = ({
  profileID,
  chatID,
  t,
  setBlockModalVisible,
  handleRemoveSelf
}) => {
  return (
    <div className="col-xl-2">
      <div className="right">
        <div className="head" />
        <div className="content">
          <div className="visit-profile">
            <span>{t('visit')}</span>
          </div>
          <div className="functions">
            <ul>
              <li className="delete">
                <span onClick={handleRemoveSelf}>{t('leaveconv')}</span>
              </li>
              <li className="report">
                <span onClick={setBlockModalVisible}>{t('reportconv')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
