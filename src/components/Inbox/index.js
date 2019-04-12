import React, { PureComponent } from "react";
import dayjs from "dayjs";

import withAuth from "../withAuth";
import { withNamespaces } from "react-i18next";
import InboxPanel from "./InboxPanel";
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
import { toast } from "react-toastify";
import ChatWindow from "./ChatWindow";
import Tour from "./Tour";
import { flagOptions } from "../../docs/options";
import validateLang from "../../utils/validateLang";

import * as ErrorHandler from "../common/ErrorHandler";
import Modal from "../common/Modal";

class InboxPage extends PureComponent {
  state = {
    chatID: this.props.match.params.chatID,
    chat: null,
    unSeenCount: 0,
    blockModalVisible: false,
    showModal: false,
    msg: "",
    btnText: "",
    title: "",
    chatOpen: false
  };

  componentDidMount() {
    this.mounted = true;
    const lang = validateLang(localStorage.getItem("i18nextLng"));
    require("dayjs/locale/" + lang);

    document.title = "Inbox";
    sessionStorage.setItem("page", "inbox");
  }

  componentWillUnmount() {
    this.mounted = false;
    sessionStorage.setItem("page", null);
    sessionStorage.setItem("pid", null);
  }

  setBlockModalVisible = () => {
    const { chatID, blockModalVisible } = this.state;
    ErrorHandler.setBreadcrumb("Block modal visible:" + !blockModalVisible);
    if (this.mounted) {
      this.setState({ chatID, blockModalVisible: !blockModalVisible });
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
    ErrorHandler.setBreadcrumb("Open Chat:" + chatID);
    this.setState({ chatID, unSeenCount, chatOpen: true }, () => {
      readChat()
        .then(({ data }) => {
          if (this.mounted) {
            this.setState({ chatID: data.readChat });
          }
        })
        .catch(res => {
          ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  closeChat = () => {
    this.setState({ chatID: null, chatOpen: false });
  };

  handleRemoveSelf = removeSelf => {
    ErrorHandler.setBreadcrumb("Remove Self from Chat:" + this.state.chatID);
    removeSelf()
      .then(({ data }) => {
        if (this.mounted) {
          toast.success("Successfully left Chat");
          this.setState({ chat: null });
          this.props.refetch();
          this.props.history.push("/inbox");
        }
      })
      .catch(res => {
        ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  updateMail = cache => {
    const { chatID } = this.state;

    const { getInbox } = cache.readQuery({
      query: GET_INBOX
    });
    const updatedInbox = getInbox.filter(x => x.chatID !== chatID);
    cache.writeQuery({
      query: GET_INBOX,
      data: {
        getInbox: updatedInbox
      }
    });
  };

  updateCount = cache => {
    const { unSeenCount, chatID } = this.state;

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
      query: GET_INBOX
    });

    const chatIndex = getInbox.findIndex(chat => chat.chatID === chatID);
    if (chatIndex > -1) {
      getInbox[chatIndex].unSeenCount = 0;

      cache.writeQuery({
        query: GET_INBOX,
        data: {
          getInbox
        }
      });
    }
  };

  render() {
    const { t } = this.props;
    const { currentuser } = this.props.session;
    let {
      chatID,
      chat,
      blockModalVisible,
      showModal,
      msg,
      btnText,
      title,
      chatOpen
    } = this.state;
    if (currentuser.tours.indexOf("i") < 0) {
      ErrorHandler.setBreadcrumb("Opened Tour: Inbox");
      return (
        <div>
          <Tour ErrorHandler={ErrorHandler} refetchUser={this.props.refetch} />
        </div>
      );
    }

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
                chatOpen={chatOpen}
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
          <div className="row no-gutters">
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
                />
              )}
              {chatID && (
                <Query query={READ_CHAT_QUERY} variables={{ chatID }}>
                  {({ data, loading, error }) => {
                    if (error) {
                      return (
                        <ErrorHandler.report
                          error={error}
                          calledName={"getEvent"}
                          targetID={chatID}
                          type="chat"
                          userID={currentuser.userID}
                        />
                      );
                    }

                    if (loading) {
                      return (
                        <Spinner
                          message={t("common:Loading" + "...")}
                          size="large"
                        />
                      );
                    } else if (!data || !data.readChatQuery) {
                      return (
                        <div className="col-md-7">
                          No Messages found for this chat
                        </div>
                      );
                    }

                    const { readChatQuery } = data;
                    return (
                      <ChatWindow
                        currentChat={readChatQuery}
                        currentuser={currentuser}
                        t={t}
                        ErrorHandler={ErrorHandler}
                        dayjs={dayjs}
                        chatOpen={chatOpen}
                        setBlockModalVisible={this.setBlockModalVisible}
                        isOwner={
                          chat && chat.ownerProfile.id === currentuser.profileID
                        }
                        leaveDialog={() =>
                          this.setDialogContent({
                            title: "Leave Conversation",
                            msg:
                              "Are you sure you would like to leave this conversation? You will not be able to see this chat anylonger.",
                            btnText: "Leave"
                          })
                        }
                      />
                    );
                  }}
                </Query>
              )}
              {chatID && (
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
                          setBlockModalVisible={this.setBlockModalVisible}
                          chatID={chatID}
                          isOwner={
                            chat &&
                            chat.ownerProfile.id === currentuser.profileID
                          }
                          leaveDialog={() =>
                            this.setDialogContent({
                              title: "Leave Conversation",
                              msg:
                                "Are you sure you would like to leave this conversation? You will not be able to see this chat anylonger.",
                              btnText: "Leave"
                            })
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
              )}
            </ErrorHandler.ErrorBoundary>
          </div>
          {blockModalVisible && (
            <BlockModal
              type={flagOptions.Chat}
              id={chatID}
              close={this.setBlockModalVisible}
              ErrorHandler={ErrorHandler}
            />
          )}
        </section>
      </>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withNamespaces("inbox")(InboxPage)
);
