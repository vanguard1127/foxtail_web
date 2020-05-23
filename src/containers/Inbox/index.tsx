import React, { memo, useState, useRef, useEffect } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { withApollo } from "react-apollo";
import produce from "immer";
import Lightbox from "react-image-lightbox";

import Spinner from "components/common/Spinner";
import RulesModal from "components/Modals/Rules";
import BlockModal from "components/Modals/Block";
import deleteFromCache from "utils/deleteFromCache";
import {
  GET_INBOX,
  GET_COUNTS,
  NEW_MESSAGE_SUB,
  MESSAGE_ACTION_SUB
} from "queries";
import { ISession } from "types/user";

import { flagOptions } from "../../docs/options";

import InboxPanel from "./InboxPanel";
import Header from "./Header";
import ChatWindow from "./ChatWindow";
import Chat from "./Chat";

import "./inbox.css";

const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT || '12');

interface MatchParams {
  chatID: string;
}

interface IInboxProps extends RouteComponentProps<MatchParams>, WithTranslation {
  ReactGA: any;
  ErrorHandler: any;
  client: any;
  session: ISession;
  lang: string;
}

const Inbox: React.FC<IInboxProps> = memo(({
  ReactGA,
  ErrorHandler,
  client,
  session,
  lang,
  history,
  match,
  tReady,
  t,
}) => {
  const unsubscribe = useRef(() => { });
  const unsubscribe2 = useRef(() => { });
  const [state, setState] = useState<any>({
    blockModalVisible: false,
    chatID: match.params.chatID,
    showRulesModal: false,
    previewVisible: false,
    selectedImg: null
  });

  useEffect(() => {
    document.title = t("common:Inbox");
    sessionStorage.setItem("page", "inbox");
    return () => {
      unsubscribe.current();
      unsubscribe2.current();
      sessionStorage.setItem("page", '');
      sessionStorage.setItem("pid", '');
    }
  }, [])

  useEffect(() => {
    if (match.params.chatID !== state.chatID) {
      setState({ ...state, chatID: match.params.chatID })
    }
  }, [match])

  const setBlockModalVisible = () => {
    const { blockModalVisible } = state;
    ErrorHandler.setBreadcrumb("Block modal visible:" + !blockModalVisible);
    setState({ ...state, blockModalVisible: !blockModalVisible });
  };



  const openChat = chatID => {
    ErrorHandler.setBreadcrumb("Open Chat:" + chatID);
    unsubscribe.current();
    unsubscribe2.current();
    const { cache } = client;
    deleteFromCache({ cache, query: "getMessages" });
    history.push(`/inbox/${chatID}`);
  };

  const closeChat = () => {
    unsubscribe.current();
    unsubscribe2.current();
    history.push("/inbox");
  };

  const toggleRuleModal = () => {
    setState({ ...state, showRulesModal: !state.showRulesModal });
  };

  const updateCount = unSeenCount => {
    const { cache } = client;
    const { chatID } = state;
    const { getCounts } = cache.readQuery({
      query: GET_COUNTS
    });

    let newCounts = { ...getCounts };

    if (unSeenCount === null) {
      unSeenCount = 1;
    }

    newCounts.msgsCount = newCounts.msgsCount - unSeenCount;
    if (newCounts.msgsCount < 0) {
      newCounts.msgsCount = 0;
    }

    cache.writeQuery({
      query: GET_COUNTS,
      data: {
        getCounts: { ...newCounts }
      }
    });

    const { getInbox } = cache.readQuery({
      query: GET_INBOX,
      variables: {
        limit,
        skip: 0,
        isMobile: sessionStorage.getItem("isMobile")
      }
    });

    const chatIndex = getInbox.findIndex(chat => chat.chatID === chatID);

    if (chatIndex > -1) {
      const newData = produce(getInbox, draftState => {
        draftState[chatIndex].unSeenCount = 0;
      });
      cache.writeQuery({
        query: GET_INBOX,
        variables: {
          limit,
          skip: 0,
          isMobile: sessionStorage.getItem("isMobile")
        },
        data: {
          getInbox: [...newData]
        }
      });
    }
  };

  const subscribeToMessages = subscribeToMore => {
    unsubscribe.current = subscribeToMore({
      document: NEW_MESSAGE_SUB,
      variables: {
        chatID: state.chatID,
        isMobile: sessionStorage.getItem("isMobile"),
        maxW: window.outerWidth,
        maxH: window.outerHeight
      },
      updateQuery: (prev, { subscriptionData }) => {
        const { newMessageSubscribe } = subscriptionData.data;
        if (!newMessageSubscribe) {
          return prev;
        }

        const newData = produce(prev, draftState => {
          if (draftState.getMessages.messages) {
            draftState.getMessages.messages = [
              newMessageSubscribe,
              ...draftState.getMessages.messages
            ];
          } else {
            draftState.getMessages.messages = [newMessageSubscribe];
          }
        });

        return newData;
      }
    });

    unsubscribe2.current = subscribeToMore({
      document: MESSAGE_ACTION_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        const { messageActionSubsubscribe } = subscriptionData.data;
        if (!messageActionSubsubscribe) {
          return prev;
        }
        const newData = produce(prev, draftState => {
          const newMsgs = draftState.getMessages;
          //TODO: FIX PRE PUSH
          //console.log("test", messageActionSubsubscribe.isActive);
          if (!messageActionSubsubscribe.seenBy) {
            if (
              messageActionSubsubscribe.isTyping &&
              messageActionSubsubscribe.isActive
            ) {
              if (!newMsgs.typingList) {
                newMsgs.typingList = [messageActionSubsubscribe.name];
              } else {
                newMsgs.typingList.push(messageActionSubsubscribe.name);
              }
            } else if (newMsgs.typingList) {
              newMsgs.typingList = newMsgs.typingList.filter((_, i, rep) => {
                return i !== rep.indexOf(messageActionSubsubscribe.name);
              });
            }
            if (newMsgs.typingList) {
              switch (newMsgs.typingList.length) {
                case 0:
                  newMsgs.typingText = null;
                  break;
                case 1:
                  newMsgs.typingText =
                    newMsgs.typingList[0] + " is typing...";
                  break;
                default:
                  newMsgs.typingText = "Members are typing...";
                  break;
              }
            }
          }
        });

        return newData;
      }
    });
  };

  const handlePreview = e => {
    setState({
      ...state,
      selectedImg: e.target.getAttribute("data-fullSrc"),
      previewVisible: true
    });
  };

  const closePreview = () => {
    setState({
      ...state,
      previewVisible: false
    });
  };

  let {
    blockModalVisible,
    chatID,
    showRulesModal,
    previewVisible,
    selectedImg
  } = state;

  const chatOpen = chatID ? true : false;

  if (!tReady || !session) {
    return <Spinner />;
  }

  const { currentuser } = session;

  return (
    <div>
      <ErrorHandler.ErrorBoundary>
        <Header
          t={t}
          chatOpen={chatOpen}
          closeChat={closeChat}
          toggleRuleModal={toggleRuleModal}
        />
      </ErrorHandler.ErrorBoundary>
      <section className={!chatID ? "inbox" : "inbox hide-mobile"}>
        <div className="row no-gutters chat-window-wrapper">
          <ErrorHandler.ErrorBoundary>
            <InboxPanel
              currentuser={currentuser}
              openChat={openChat}
              chatID={chatOpen ? chatID : null}
              updateCount={updateCount}
              t={t}
            />
          </ErrorHandler.ErrorBoundary>
          <ErrorHandler.ErrorBoundary>
            {!chatID && (
              <ChatWindow
                currentChat={null}
                currentuser={currentuser}
                chatOpen={chatOpen}
                lang={lang}
                history={history}
                t={t}
              />
            )}
            {chatID &&
              <Chat
                cache={client.cache}
                currentuser={currentuser}
                handlePreview={handlePreview}
                chatID={state.chatID}
                setBlockModalVisible={setBlockModalVisible}
                lang={lang}
                subscribeToMessages={subscribeToMessages}
                closeChat={closeChat}
                t={t}
              />
            }
          </ErrorHandler.ErrorBoundary>
        </div>
        {showRulesModal && <RulesModal close={toggleRuleModal} t={t} />}
        {previewVisible && (
          <Lightbox
            mainSrc={selectedImg}
            onCloseRequest={closePreview}
          />
        )}
        {blockModalVisible && (
          <BlockModal
            type={flagOptions.Chat}
            id={chatID}
            close={setBlockModalVisible}
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
          />
        )}
      </section>
    </div>
  );
});

export default withApollo(withTranslation(["inbox", "footer"])(Inbox));
