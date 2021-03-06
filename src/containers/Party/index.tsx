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
import { NEW_MESSAGE_SUB, MESSAGE_ACTION_SUB } from "queries";
import { ISession } from "types/user";

import { flagOptions } from "../../docs/options";

import InboxPanel from "./InboxPanel";
import Header from "./Header";
import ChatWindow from "./ChatWindow";
import Chat from "./Chat";

import "./party.css";

const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT || "12");
interface MatchParams {
  chatID: string;
}

interface IPartyProps
  extends RouteComponentProps<MatchParams>,
    WithTranslation {
  ReactGA: any;
  ErrorHandler: any;
  client: any;
  session: ISession;
  lang: string;
}

const Inbox: React.FC<IPartyProps> = memo(
  ({
    ReactGA,
    ErrorHandler,
    client,
    session,
    lang,
    history,
    match,
    tReady,
    t
  }) => {
    const unsubscribe = useRef(null);
    const unsubscribe2 = useRef(null);

    const [state, setState] = useState<any>({
      blockModalVisible: false,
      chatID: match.params.chatID,
      showRulesModal: false,
      previewVisible: false,
      selectedImg: null
    });

    useEffect(() => {
      document.title = t("common:Inbox");
      sessionStorage.setItem("page", "chat");
      return () => {
        if (unsubscribe.current) {
          unsubscribe.current();
        }
        if (unsubscribe2.current) {
          unsubscribe2.current();
        }
        sessionStorage.setItem("page", "");
        sessionStorage.setItem("pid", "");
      };
    }, []);

    useEffect(() => {
      if (match.params.chatID !== state.chatID) {
        setState({ ...state, chatID: match.params.chatID });
      }
    }, [match]);

    const setBlockModalVisible = () => {
      const { blockModalVisible } = state;
      ErrorHandler.setBreadcrumb("Block modal visible:" + !blockModalVisible);
      setState({ ...state, blockModalVisible: !blockModalVisible });
    };

    const openChat = (chatID) => {
      console.log("chatpart", chatID);
      ErrorHandler.setBreadcrumb("Open Chat:" + chatID);
      if (unsubscribe.current) {
        unsubscribe.current();
      }
      if (unsubscribe2.current) {
        unsubscribe2.current();
      }
      const { cache } = client;
      deleteFromCache({ cache, query: "getMessages" });
      history.push(`/chat/${chatID}`);
    };

    const closeChat = () => {
      console.log("close pert");
      if (unsubscribe.current) {
        unsubscribe.current();
      }
      if (unsubscribe2.current) {
        unsubscribe2.current();
      }
      history.push("/chat");
    };

    const toggleRuleModal = () => {
      setState({ ...state, showRulesModal: !state.showRulesModal });
    };

    const subscribeToMessages = (subscribeToMore) => {
      console.log("object", state.chatID);
      if (!unsubscribe.current) {
        console.log("12");
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

            const newData = produce(prev, (draftState) => {
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
      }
      if (!unsubscribe2.current) {
        console.log("56556");
        unsubscribe2.current = subscribeToMore({
          document: MESSAGE_ACTION_SUB,
          updateQuery: (prev, { subscriptionData }) => {
            const { messageActionSubsubscribe } = subscriptionData.data;
            if (!messageActionSubsubscribe) {
              return prev;
            }
            const newData = produce(prev, (draftState) => {
              const newMsgs = draftState.getMessages;
              //TODO: FIX PRE PUSH
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
                  newMsgs.typingList = newMsgs.typingList.filter(
                    (_, i, rep) => {
                      return i !== rep.indexOf(messageActionSubsubscribe.name);
                    }
                  );
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
      }
    };

    const handlePreview = (e) => {
      setState({
        ...state,
        selectedImg: e.target.getAttribute("data-fullsrc"),
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
              <InboxPanel currentuser={currentuser} openChat={openChat} t={t} />
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
              {chatID && (
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
              )}
            </ErrorHandler.ErrorBoundary>
          </div>
          {showRulesModal && <RulesModal close={toggleRuleModal} t={t} />}
          {previewVisible && (
            <Lightbox mainSrc={selectedImg} onCloseRequest={closePreview} />
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
  }
);

export default withApollo(withTranslation(["inbox", "footer"])(Inbox));
