import React, { memo, useState } from "react";
import { WithT } from "i18next";

import AdManager from "components/common/Ad";
import { IUser } from "types/user";

import ChatHeader from "./ChatHeader";
import ChatPanel from "./ChatPanel";
import Messages from "../Messages";

interface IChatWindowProps extends WithT {
  currentChat: any,
  currentuser: IUser,
  chatOpen: boolean,
  lang: string,
  history: any,
  setBlockModalVisible?: () => void,
  isOwner?: boolean,
  leaveDialog?: () => void,
  fetchMore?: any,
  subscribeToMore?: any,
  handlePreview?: (e: any) => void,
}

const ChatWindow: React.FC<IChatWindowProps> = memo(({
  currentChat,
  currentuser,
  chatOpen,
  lang,
  history,
  setBlockModalVisible,
  isOwner,
  leaveDialog,
  fetchMore,
  subscribeToMore,
  handlePreview,
  t,
}) => {
  const [state, setState] = useState({
    loading: false,
    cursor: null,
    hasMoreItems: true,
    overlay: false
  });

  const toggleOverlay = () => {
    setState({ ...state, overlay: !state.overlay });
  };

  const onMenuClick = state => {
    history.push({
      state,
      pathname: "/settings"
    });
  };

  const onAddCouple = () => {
    onMenuClick({ showCplMdl: true });
  };

  const onShowBlackMember = () => {
    onMenuClick({ showBlkMdl: true });
  };

  if (currentChat) {
    sessionStorage.setItem("pid", currentChat.id);
  } else {
    sessionStorage.removeItem("pid");
  }
  return (
    <div className="col-md-8 col-lg-9 col-xl-7">
      {currentChat !== null ? (
        <div className={`chat${chatOpen ? ' show' : ''}${state.overlay ? ' overlay' : ''}`}>
          <ChatHeader
            currentChat={currentChat}
            currentuser={currentuser}
            chatID={currentChat.id}
            setBlockModalVisible={setBlockModalVisible}
            isOwner={isOwner}
            leaveDialog={leaveDialog}
            t={t}
          />
          <div
            className="content"
            style={{
              display: "flex",
              flexDirection: "column-reverse"
            }}
          >
            <Messages
              messages={currentChat.messages}
              currentUserID={currentuser.userID}
              subscribeToMore={subscribeToMore}
              chatID={currentChat.id}
              limit={parseInt(process.env.REACT_APP_INBOXMSG_LIMIT || '12')}
              fetchMore={fetchMore}
              lang={lang}
              typingText={currentChat.typingText}
              handlePreview={handlePreview}
              t={t}
            />
          </div>
          <ChatPanel
            chatID={currentChat.id}
            t={t}
            toggleOverlay={toggleOverlay}
            isEmailOK={currentuser.isEmailOK}
          />
        </div>
      ) : (
          <AdManager
            t={t}
            goToBlk={onShowBlackMember}
            goToCpl={onAddCouple}
          />
        )}
    </div>
  );
});

export default ChatWindow;
