import React, { Component } from "react";
import dayjs from "dayjs";

import { withTranslation } from "react-i18next";
import produce from "immer";
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
  NEW_MESSAGE_SUB
} from "../../queries";
import { Mutation, Query, withApollo } from "react-apollo";
import ChatWindow from "./ChatWindow/";
import Tour from "./Tour";
import { flagOptions } from "../../docs/options";
import * as ErrorHandler from "../common/ErrorHandler";
import Modal from "../common/Modal";
import deleteFromCache from "../../utils/deleteFromCache";
import getLang from "../../utils/getLang";
const lang = getLang();
require("dayjs/locale/" + lang);
const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT);

class InboxPage extends Component {
  unsubscribe;
  readChat;
  state = {
    unSeenCount: 0,
    blockModalVisible: false,
    showModal: false,
    msg: "",
    btnText: "",
    title: "",
    chatOpen: this.props.location.state ? true : false,
    chatID: this.props.location.state ? this.props.location.state.chatID : null,
    showRulesModal: false,
    isBlock: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.showRulesModal !== nextState.showRulesModal ||
      this.state.blockModalVisible !== nextState.blockModalVisible ||
      this.state.chatOpen !== nextState.chatOpen ||
      this.state.showModal !== nextState.showModal ||
      this.state.chatID !== nextState.chatID ||
      this.state.isBlock !== nextState.isBlock ||
      this.props.location.state !== nextProps.location.state ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
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
    this.props.history.replace({ state: {} });
    this.setState({ chatOpen: false, chatID: null });
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
        limit: parseInt(process.env.REACT_APP_INBOXLIST_LIMIT)
      }
    });
    const updatedInbox = getInbox.filter(x => x.chatID !== chatID);

    cache.writeQuery({
      query: GET_INBOX,
      variables: {
        limit: parseInt(process.env.REACT_APP_INBOXLIST_LIMIT),
        skip: 0
      },
      data: {
        getInbox: [...updatedInbox]
      }
    });
  };

  handleChatClick = (chatID, unSeenCount) => {
    const { ErrorHandler } = this.props;
    ErrorHandler.setBreadcrumb("Open Chat:" + chatID);
    if (this.mounted) {
      const { cache } = this.props.client;
      deleteFromCache({ cache, query: "getMessages" });
      this.updateCount(chatID, unSeenCount);
      this.setState({ unSeenCount, chatID, chatOpen: true });
    }
  };

  toggleRuleModal = () => {
    this.setState({ showRulesModal: !this.state.showRulesModal });
  };

  updateCount = (chatID, unSeenCount) => {
    const { cache } = this.props.client;
    const { getCounts } = cache.readQuery({
      query: GET_COUNTS
    });

    let newCounts = { ...getCounts };

    if (unSeenCount === null) {
      unSeenCount = 1;
    }

    newCounts.msgsCount = newCounts.msgsCount - unSeenCount;

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
        skip: 0
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
          skip: 0
        },
        data: {
          getInbox: [...newData]
        }
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
      chatOpen,
      chatID,
      showRulesModal,
      isBlock
    } = this.state;

    const { t, ReactGA, session, history, tReady } = this.props;

    if (!tReady || !session) {
      return <Spinner />;
    }

    const { currentuser } = session;
    if (currentuser.tours.indexOf("i") < 0) {
      ErrorHandler.setBreadcrumb("Opened Tour: Inbox");
      return (
        <div>
          <Tour
            ErrorHandler={ErrorHandler}
            refetchUser={this.props.refetch}
            session={session}
          />
        </div>
      );
    }

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
        <section className={!chatOpen ? "inbox" : "inbox hide-mobile"}>
          <div className="row no-gutters chat-window-wrapper">
            <ErrorHandler.ErrorBoundary>
              <InboxPanel
                currentuser={currentuser}
                ErrorHandler={ErrorHandler}
                t={t}
                history={this.props.history}
                client={this.props.client}
                readChat={(id, unSeenCount) =>
                  this.handleChatClick(id, unSeenCount)
                }
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
                    cursor: null
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
                          subscribeToMore={() => {
                            subscribeToMore({
                              document: NEW_MESSAGE_SUB,
                              variables: {
                                chatID: chatID
                              },
                              updateQuery: (prev, { subscriptionData }) => {
                                const {
                                  newMessageSubscribe
                                } = subscriptionData.data;
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
                                    draftState.getMessages.messages = [
                                      newMessageSubscribe
                                    ];
                                  }
                                });

                                return newData;
                              }
                            });
                          }}
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
                                    close={() => this.toggleDialog()}
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

export default withApollo(withTranslation("inbox")(InboxPage));
