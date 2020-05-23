import React, { memo } from "react";
import { WithT } from "i18next";

import ChatActions from "../ChatWindow/ChatActions";

interface IChatInfoProps extends WithT {
  chatID: string,
  setBlockModalVisible: () => void,
  isOwner: boolean,
  leaveDialog: () => void,
  participantsNum: number | null
}

const ChatInfo: React.FC<IChatInfoProps> = memo(({
  chatID,
  setBlockModalVisible,
  isOwner,
  leaveDialog,
  participantsNum,
  t,
}) => {
  return (
    <div className="col-xl-2">
      <div className="right">
        <div className="head" />
        <div className="content">
          <div className="functions">
            <ChatActions
              chatID={chatID}
              setBlockModalVisible={setBlockModalVisible}
              isOwner={isOwner}
              leaveDialog={leaveDialog}
              participantsNum={participantsNum}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatInfo;
