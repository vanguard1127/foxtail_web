import React, { useState } from "react";
import ReactGA from "react-ga";
import { WithT } from "i18next";
import { useQuery, useMutation } from "react-apollo";

import * as ErrorHandler from "components/common/ErrorHandler";
import Spinner from "components/common/Spinner";
import { IUser } from "types/user";

import { REMOVE_SELF, GET_MESSAGES } from "queries";

import ChatWindow from "../ChatWindow";

import ChatInfo from "./ChatInfo";
import ChatModal from "./ChatModal";
import ChatError from "./ChatError";

const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT || "12");

interface IChatProps extends WithT {
  currentuser: IUser;
  cache: any;
  handlePreview: (e: any) => void;
  chatID: string;
  setBlockModalVisible: () => void;
  lang: string;
  subscribeToMessages: (subscribeToMore: any) => void;
  closeChat: () => void;
}

const Chat: React.FC<IChatProps> = ({
  currentuser,
  handlePreview,
  chatID,
  setBlockModalVisible,
  lang,
  subscribeToMessages,
  closeChat,
  t
}) => {
  const [state, setState] = useState({
    isBlock: false,
    showModal: false
  });

  const { data, loading, error, subscribeToMore, fetchMore } = useQuery(
    GET_MESSAGES,
    {
      variables: {
        chatID: chatID,
        limit,
        cursor: null,
        isMobile: sessionStorage.getItem("isMobile"),
        maxW: window.outerWidth,
        maxH: window.outerHeight
      },
      fetchPolicy: "cache-first"
    }
  );

  const [removeSelf] = useMutation(REMOVE_SELF, {
    variables: { chatID, isBlock: state.isBlock }
  });

  const handleRemoveSelf = (removeSelf) => {
    ErrorHandler.setBreadcrumb(
      `Remove Self from Chat:${chatID} Blocked?: ${state.isBlock}`
    );
    removeSelf()
      .then(() => {
        ReactGA.event({
          category: "Chat",
          action: "Remove Self"
        });
        toggleDialog();
        closeChat();
      })
      .catch((res) => {
        ErrorHandler.catchErrors(res);
      });
  };

  const toggleDialog = () => {
    ErrorHandler.setBreadcrumb("Dialog Modal Toggled:");
    setState({ ...state, showModal: !state.showModal });
  };

  const chat = data ? data.getMessages : null;
  if (error) {
    return (
      <ChatError
        userID={currentuser.userID}
        error={error}
        chatID={chatID}
        t={t}
      />
    );
  }

  if (loading) {
    return <Spinner message={t("common:Loading")} size="large" />;
  }

  if (!data || !data.getMessages) {
    return <Spinner message={t("common:Loading")} size="large" />;
  }

  return (
    <React.Fragment>
      <ChatWindow
        currentChat={chat}
        currentuser={currentuser}
        t={t}
        chatOpen={true}
        history={history}
        setBlockModalVisible={setBlockModalVisible}
        lang={lang}
        isOwner={chat && chat.ownerProfile.id === currentuser.profileID}
        leaveDialog={toggleDialog}
        fetchMore={fetchMore}
        subscribeToMore={() => subscribeToMessages(subscribeToMore)}
        handlePreview={handlePreview}
      />
      <ChatInfo
        t={t}
        setBlockModalVisible={setBlockModalVisible}
        chatID={chatID}
        isOwner={chat && chat.ownerProfile.id === currentuser.profileID}
        leaveDialog={toggleDialog}
        participantsNum={chat && chat.participants.length}
      />
      {state.showModal && (
        <ChatModal
          title={t("leaveconv")}
          toggleDialog={toggleDialog}
          msg={t("leavewarn")}
          btnText={t("Leave")}
          onConfirm={() => {
            setState({ ...state, isBlock: false });
            handleRemoveSelf(removeSelf);
          }}
          onCancel={() => {
            setState({ ...state, isBlock: true });
            handleRemoveSelf(removeSelf);
          }}
          t={t}
        />
      )}
    </React.Fragment>
  );
};

export default Chat;
