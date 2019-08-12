import React, { Component } from "react";
import dayjs from "dayjs";

import { withTranslation } from "react-i18next";
import InboxPanel from "./InboxPanel/";
import Header from "./Header";
import ChatInfo from "./ChatInfo";
import BlockModal from "../Modals/Block";
import Spinner from "../common/Spinner";
import {
  GET_COUNTS,
  READ_CHAT,
  GET_INBOX,
  REMOVE_SELF,
  READ_CHAT_QUERY
} from "../../queries";
import { Mutation, Query } from "react-apollo";
import ChatWindow from "./ChatWindow/";
import Tour from "./Tour";
import { flagOptions } from "../../docs/options";
import * as ErrorHandler from "../common/ErrorHandler";
import Modal from "../common/Modal";
import { INBOXLIST_LIMIT } from "../../docs/consts";
import getLang from "../../utils/getLang";
const lang = getLang();
require("dayjs/locale/" + lang);

class InboxPage extends Component {
  state = {
    chat: null,
    unSeenCount: 0,
    blockModalVisible: false,
    showModal: false,
    msg: "",
    btnText: "",
    title: "",
    chatOpen: false
  };
  opening = false;
  shouldComponentUpdate(nextProps, nextState) {
    let chatIDChange = false;
    if (
      this.props.location.state !== undefined &&
      nextProps.location.state !== undefined
    ) {
      chatIDChange =
        this.props.location.state.chatID !== nextProps.location.state.chatID;
    }
    if (
      this.state.chat !== nextState.chat ||
      this.state.unSeenCount !== nextState.unSeenCount ||
      this.state.blockModalVisible !== nextState.blockModalVisible ||
      this.state.chatOpen !== nextState.chatOpen ||
      this.state.showModal !== nextState.showModal ||
      chatIDChange ||
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

  handleChatClick = (chatID, unSeenCount, readChat) => {
    if (!this.opening) {
      this.opening = true;
      ErrorHandler.setBreadcrumb("Open Chat:" + chatID);
      if (this.mounted) {
        this.props.history.replace({ state: { chatID } });
        this.setState({ unSeenCount, chatOpen: true }, () => {
          readChat()
            .then(() => {
              this.props.ReactGA.event({
                category: "Chat",
                action: "Read"
              });
              this.opening = false;
            })
            .catch(res => {
              ErrorHandler.catchErrors(res.graphQLErrors);
              this.opening = false;
            });
        });
      }
    }
  };

  closeChat = () => {
    this.props.history.replace({ state: {} });
    this.setState({ chatOpen: false });
  };

  handleRemoveSelf = removeSelf => {
    const { refetch, location, history, t } = this.props;
    const { chatID } = location.state;
    ErrorHandler.setBreadcrumb("Remove Self from Chat:" + chatID);
    removeSelf()
      .then(({ data }) => {
        if (this.mounted) {
          this.props.ReactGA.event({
            category: "Chat",
            action: "Remove Self"
          });
          refetch();
          history.push("/inbox");
        }
      })
      .catch(res => {
        ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  updateMail = cache => {
    const { chatID } = this.props.location.state;

    const { getInbox } = cache.readQuery({
      query: GET_INBOX,
      variables: { skip: 0, limit: INBOXLIST_LIMIT }
    });
    const updatedInbox = getInbox.filter(x => x.chatID !== chatID);
    cache.writeQuery({
      query: GET_INBOX,
      variables: { skip: 0, limit: INBOXLIST_LIMIT },
      data: {
        getInbox: updatedInbox
      }
    });
  };

  updateCount = cache => {
    const { unSeenCount } = this.state;
    const { chatID } = this.props.location.state;
    const { getCounts } = cache.readQuery({
      query: GET_COUNTS
    });
    getCounts.msgsCount = getCounts.msgsCount - unSeenCount;

    cache.writeQuery({
      query: GET_COUNTS,
      data: {
        getCounts
      }
    });

    const { getInbox } = cache.readQuery({
      query: GET_INBOX,
      variables: { skip: 0, limit: INBOXLIST_LIMIT }
    });

    const chatIndex = getInbox.findIndex(chat => chat.chatID === chatID);

    if (chatIndex > -1) {
      getInbox[chatIndex].unSeenCount = 0;

      cache.writeQuery({
        query: GET_INBOX,
        variables: { skip: 0, limit: INBOXLIST_LIMIT },
        data: {
          getInbox
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
      unSeenCount
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

    let chatID = this.props.location.state && this.props.location.state.chatID;

    const inboxPanel = (
      <Mutation
        mutation={READ_CHAT}
        variables={{ chatID }}
        update={this.updateCount}
      >
        {readChat => {
          return (
            <ErrorHandler.ErrorBoundary>
              <InboxPanel
                readChat={(id, unSeenCount) =>
                  this.handleChatClick(id, unSeenCount, readChat)
                }
                unSeenCount={unSeenCount}
                currentuser={currentuser}
                ErrorHandler={ErrorHandler}
                t={t}
              />
            </ErrorHandler.ErrorBoundary>
          );
        }}
      </Mutation>
    );
    return (
      <>
        <ErrorHandler.ErrorBoundary>
          <Header t={t} chatOpen={chatOpen} closeChat={this.closeChat} />
        </ErrorHandler.ErrorBoundary>
        <section className="inbox">
          <div className="row no-gutters chat-window-wrapper">
            {inboxPanel}
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
                <Query query={READ_CHAT_QUERY} variables={{ chatID }}>
                  {({ data, loading, error }) => {
                    if (error) {
                      return (
                        <section className="not-found">
                          <div className="container">
                            <div className="col-md-12">
                              <div className="icon">
                                <i className="nico x" />
                              </div>
                              <span className="head">
                                Chat No Longer Available
                              </span>
                              <span className="description">
                                This chat is no longer available
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
                    } else if (!data || !data.readChatQuery) {
                      return <div className="col-md-7">{t("nomsgs")}</div>;
                    }

                    const { readChatQuery: chat } = data;

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
                        />
                        <Mutation
                          mutation={REMOVE_SELF}
                          variables={{ chatID }}
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
                                          this.handleRemoveSelf(removeSelf)
                                        }
                                      >
                                        {btnText}
                                      </span>
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

export default withTranslation("inbox")(InboxPage);
