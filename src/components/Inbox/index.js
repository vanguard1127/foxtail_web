import React, { Component } from "react";

import { withTranslation } from "react-i18next";
import produce from "immer";
import Lightbox from "react-image-lightbox";
import RulesModal from "../Modals/Rules";
import InboxPanel from "./InboxPanel/";
import Header from "./Header";
import ChatInfo from "./ChatInfo";
import BlockModal from "../Modals/Block";
import Spinner from "../common/Spinner";
import {
  GET_INBOX,
  REMOVE_SELF,
  GET_MESSAGES,
  GET_COUNTS,
  NEW_MESSAGE_SUB,
  MESSAGE_ACTION_SUB
} from "../../queries";
import { Mutation, Query, withApollo } from "react-apollo";
import ChatWindow from "./ChatWindow/";
import { flagOptions } from "../../docs/options";
import * as ErrorHandler from "../common/ErrorHandler";
import Modal from "../common/Modal";
import deleteFromCache from "../../utils/deleteFromCache";
import "./inbox.css";
const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT);

class InboxPage extends Component {
  unsubscribe;
  unsubscribe2;
  state = {
    blockModalVisible: false,
    showModal: false,
    msg: "",
    btnText: "",
    title: "",
    chatID: this.props.location.state ? this.props.location.state.chatID : null,
    showRulesModal: false,
    isBlock: false,
    previewVisible: false,
    selectedImg: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.showRulesModal !== nextState.showRulesModal ||
      this.state.blockModalVisible !== nextState.blockModalVisible ||
      this.state.showModal !== nextState.showModal ||
      this.state.chatID !== nextState.chatID ||
      this.state.isBlock !== nextState.isBlock ||
      this.props.location.state !== nextProps.location.state ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady ||
      this.state.previewVisible !== nextState.previewVisible ||
      this.state.selectedImg !== nextState.selectedImg
    ) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    this.mounted = true;
    document.title = this.props.t("common:Inbox");
    sessionStorage.setItem("page", "inbox");
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.unsubscribe2) {
      this.unsubscribe2();
    }
    this.mounted = false;
    sessionStorage.setItem("page", null);
    sessionStorage.setItem("pid", null);
  }

  setBlockModalVisible = () => {
    const { blockModalVisible } = this.state;
    ErrorHandler.setBreadcrumb("Block modal visible:" + !blockModalVisible);
    if (this.mounted) {
      this.setState({ blockModalVisible: !blockModalVisible });
    }
  };

  toggleDialog = () => {
    ErrorHandler.setBreadcrumb("Dialog Modal Toggled:");
    this.setState({ showModal: !this.state.showModal });
  };

  setDialogContent = ({ title, msg, btnText }) => {
    this.setState({ title, msg, btnText }, () => this.toggleDialog());
  };

  closeChat = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.unsubscribe2) {
      this.unsubscribe2();
    }
    this.setState({ chatID: null });
    this.props.history.replace({ state: {} });
  };

  handleRemoveSelf = removeSelf => {
    const { chatID, isBlock } = this.state;
    ErrorHandler.setBreadcrumb(
      "Remove Self from Chat:" + chatID + " Blocked?: " + isBlock
    );
    removeSelf()
      .then(() => {
        if (this.mounted) {
          this.props.ReactGA.event({
            category: "Chat",
            action: "Remove Self"
          });
          this.toggleDialog();
          this.closeChat();
        }
      })
      .catch(res => {
        ErrorHandler.catchErrors(res);
      });
  };

  updateMail = cache => {
    const { chatID } = this.state;

    const { getInbox } = cache.readQuery({
      query: GET_INBOX,
      variables: {
        skip: 0,
        limit: parseInt(process.env.REACT_APP_INBOXLIST_LIMIT),
        isMobile: sessionStorage.getItem("isMobile")
      }
    });
    const updatedInbox = getInbox.filter(x => x.chatID !== chatID);

    cache.writeQuery({
      query: GET_INBOX,
      variables: {
        limit: parseInt(process.env.REACT_APP_INBOXLIST_LIMIT),
        skip: 0,
        isMobile: sessionStorage.getItem("isMobile")
      },
      data: {
        getInbox: [...updatedInbox]
      }
    });
  };
  //TODO
  openChat = chatID => {
    if (this.mounted) {
      const { cache } = this.props.client;
      deleteFromCache({ cache, query: "getMessages" });
      this.setState({ chatID });
    }
  };

  toggleRuleModal = () => {
    this.setState({ showRulesModal: !this.state.showRulesModal });
  };

  updateCount = unSeenCount => {
    const { cache } = this.props.client;
    const { chatID } = this.state;
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

  subscribeToMessages = subscribeToMore => {
    this.unsubscribe = subscribeToMore({
      document: NEW_MESSAGE_SUB,
      variables: {
        chatID: this.state.chatID,
        isMobile: sessionStorage.getItem("isMobile")
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

    if (!this.unsubscribe2) {
      this.unsubscribe2 = subscribeToMore({
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
                newMsgs.typingList = newMsgs.typingList.filter(function(
                  elem,
                  i,
                  rep
                ) {
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
    }
  };

  handlePreview = e => {
    if (this.mounted) {
      this.setState({
        selectedImg: e.target.getAttribute("src"),
        previewVisible: true
      });
    }
  };
  closePreview = () => {
    if (this.mounted) {
      this.setState({
        previewVisible: false
      });
    }
  };

  render() {
    let {
      blockModalVisible,
      showModal,
      msg,
      btnText,
      title,
      chatID,
      showRulesModal,
      isBlock,
      previewVisible,
      selectedImg
    } = this.state;

    const { t, ReactGA, session, history, tReady, dayjs, lang } = this.props;
    const chatOpen = chatID ? true : false;
    if (!tReady || !session) {
      return <Spinner />;
    }

    const { currentuser } = session;
    return (
      <>
        <ErrorHandler.ErrorBoundary>
          <Header
            t={t}
            chatOpen={chatOpen}
            closeChat={this.closeChat}
            toggleRuleModal={this.toggleRuleModal}
          />
        </ErrorHandler.ErrorBoundary>
        <section className={!chatID ? "inbox" : "inbox hide-mobile"}>
          <div className="row no-gutters chat-window-wrapper">
            <ErrorHandler.ErrorBoundary>
              <InboxPanel
                currentuser={currentuser}
                ErrorHandler={ErrorHandler}
                t={t}
                history={this.props.history}
                client={this.props.client}
                openChat={this.openChat}
                chatID={chatOpen ? chatID : null}
                updateCount={this.updateCount}
              />
            </ErrorHandler.ErrorBoundary>
            <ErrorHandler.ErrorBoundary>
              {!chatID && (
                <ChatWindow
                  currentChat={null}
                  currentuser={currentuser}
                  t={t}
                  ErrorHandler={ErrorHandler}
                  dayjs={dayjs}
                  chatOpen={chatOpen}
                  lang={lang}
                  ReactGA={ReactGA}
                  history={history}
                />
              )}
              {chatID && (
                <Query
                  query={GET_MESSAGES}
                  variables={{
                    chatID,
                    limit: parseInt(process.env.REACT_APP_CHATMSGS_LIMIT),
                    cursor: null,
                    isMobile: sessionStorage.getItem("isMobile")
                  }}
                  fetchPolicy="cache-first"
                >
                  {({
                    data,
                    loading,
                    error,
                    subscribeToMore,
                    fetchMore,
                    refetch
                  }) => {
                    if (error) {
                      return (
                        <section className="not-found">
                          <div className="container">
                            <div className="col-md-12">
                              <div className="icon">
                                <i className="nico x" />
                              </div>
                              <span className="head">
                                {t("Chat No Longer Available")}
                              </span>
                              <span className="description">
                                {t("This chat is no longer available")}
                              </span>
                              <span style={{ display: "none" }}>
                                <ErrorHandler.report
                                  error={error}
                                  calledName={"getMessages"}
                                  userID={currentuser.userID}
                                  targetID={chatID}
                                  type="chat"
                                />
                              </span>
                            </div>
                          </div>
                        </section>
                      );
                    }

                    if (loading) {
                      return (
                        <Spinner message={t("common:Loading")} size="large" />
                      );
                    } else if (!data || !data.getMessages) {
                      refetch();
                      return (
                        <Spinner message={t("common:Loading")} size="large" />
                      );
                    }

                    const { getMessages: chat } = data;

                    return (
                      <>
                        <ChatWindow
                          currentChat={chat}
                          currentuser={currentuser}
                          t={t}
                          ErrorHandler={ErrorHandler}
                          dayjs={dayjs}
                          chatOpen={chatOpen}
                          history={history}
                          setBlockModalVisible={this.setBlockModalVisible}
                          lang={lang}
                          ReactGA={ReactGA}
                          isOwner={
                            chat &&
                            chat.ownerProfile.id === currentuser.profileID
                          }
                          leaveDialog={() => {
                            const title = t("leaveconv");
                            const msg = t("leavewarn");
                            const btnText = t("Leave");
                            this.setDialogContent({
                              title,
                              msg,
                              btnText
                            });
                          }}
                          fetchMore={fetchMore}
                          cache={this.props.client.cache}
                          subscribeToMore={() =>
                            this.subscribeToMessages(subscribeToMore)
                          }
                          handlePreview={this.handlePreview}
                        />
                        <Mutation
                          mutation={REMOVE_SELF}
                          variables={{ chatID, isBlock }}
                          update={this.updateMail}
                        >
                          {removeSelf => {
                            return (
                              <>
                                <ChatInfo
                                  ErrorHandler={ErrorHandler}
                                  t={t}
                                  setBlockModalVisible={
                                    this.setBlockModalVisible
                                  }
                                  chatID={chatID}
                                  isOwner={
                                    chat &&
                                    chat.ownerProfile.id ===
                                      currentuser.profileID
                                  }
                                  leaveDialog={() => {
                                    const title = t("leaveconv");
                                    const msg = t("leavewarn");
                                    const btnText = t("Leave");
                                    this.setDialogContent({
                                      title,
                                      msg,
                                      btnText
                                    });
                                  }}
                                  ReactGA={ReactGA}
                                  participantsNum={
                                    chat && chat.participants.length
                                  }
                                />
                                {showModal && (
                                  <Modal
                                    header={title}
                                    close={this.toggleDialog}
                                    description={msg}
                                    okSpan={
                                      <span
                                        className="color"
                                        onClick={() =>
                                          this.setState(
                                            { isBlock: false },
                                            () =>
                                              this.handleRemoveSelf(removeSelf)
                                          )
                                        }
                                      >
                                        {btnText}
                                      </span>
                                    }
                                    cancelSpan={
                                      <>
                                        <span
                                          className="color"
                                          onClick={() => {
                                            this.setState(
                                              { isBlock: true },
                                              () =>
                                                this.handleRemoveSelf(
                                                  removeSelf
                                                )
                                            );
                                          }}
                                        >
                                          {t("leaveBlock")}
                                        </span>
                                        <span className="description">
                                          {t("leaveBlockwarn")}
                                        </span>
                                      </>
                                    }
                                  />
                                )}
                              </>
                            );
                          }}
                        </Mutation>
                      </>
                    );
                  }}
                </Query>
              )}
            </ErrorHandler.ErrorBoundary>
          </div>
          {showRulesModal && <RulesModal close={this.toggleRuleModal} t={t} />}
          {previewVisible && (
            <Lightbox
              mainSrc={selectedImg}
              onCloseRequest={this.closePreview}
            />
          )}
          {blockModalVisible && (
            <BlockModal
              type={flagOptions.Chat}
              id={chatID}
              close={this.setBlockModalVisible}
              ErrorHandler={ErrorHandler}
              ReactGA={ReactGA}
            />
          )}
        </section>
      </>
    );
  }
}

export default withApollo(withTranslation(["inbox", "footer"])(InboxPage));
