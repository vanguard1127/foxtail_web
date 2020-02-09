import React, { Component } from "react";
import { Query } from "react-apollo";
import produce from "immer";
import Spinner from "../../common/Spinner";
import InboxSearchTextBox from "./InboxSearchTextBox";
import InboxList from "./InboxList";
import { GET_INBOX, NEW_INBOX_SUB, MESSAGE_ACTION_SUB } from "../../../queries";
const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT);
class InboxPanel extends Component {
  unsubscribe;
  unsubscribe2;
  state = { searchTerm: "", skip: 0 };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.searchTerm !== nextState.searchTerm ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.unsubscribe2) {
      this.unsubscribe2();
    }
    this.mounted = false;
  }

  handleSearchTextChange = (refetch, e) => {
    if (this.mounted) {
      this.setState({ skip: 0, searchTerm: e.target.value });
      if (e.target.value === "") {
        refetch();
      }
    }
  };

  fetchData = fetchMore => {
    if (this.mounted) {
      const { skip } = this.state;
      this.setState(
        {
          skip: skip + limit,
          loading: true
        },
        () =>
          fetchMore({
            variables: {
              skip: this.state.skip,
              limit: limit
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (this.mounted) {
                this.setState({ loading: false });
              }

              if (
                !fetchMoreResult ||
                !fetchMoreResult.getInbox ||
                !fetchMoreResult.getInbox.length === 0
              ) {
                return previousResult;
              }
              previousResult.getInbox = [
                ...previousResult.getInbox,
                ...fetchMoreResult.getInbox
              ];

              return previousResult;
            }
          })
      );
    }
  };

  render() {
    const { currentuser, t, ErrorHandler, openChat } = this.props;
    const { searchTerm, skip } = this.state;

    return (
      <Query
        query={GET_INBOX}
        variables={{
          skip,
          limit
        }}
        fetchPolicy="cache-first"
      >
        {({ data, loading, error, subscribeToMore, fetchMore, refetch }) => {
          if (loading) {
            return (
              <div className="col-md-4 col-lg-3 col-xl-3">
                <div className="left">
                  <InboxSearchTextBox t={t} handleSearchTextChange={null} />
                  <Spinner page="inbox" title={t("allmems")} />
                </div>
              </div>
            );
          }

          if (!this.unsubscribe) {
            this.unsubscribe = subscribeToMore({
              document: NEW_INBOX_SUB,
              updateQuery: (prev, { subscriptionData }) => {
                const { newInboxMsgSubscribe } = subscriptionData.data;
                if (!newInboxMsgSubscribe) {
                  return prev;
                }

                let previousResult = Array.from(prev.getInbox);

                if (previousResult) {
                  const chatIndex = previousResult.findIndex(
                    el => el.chatID === newInboxMsgSubscribe.chatID
                  );

                  if (chatIndex > -1) {
                    previousResult[chatIndex] = newInboxMsgSubscribe;
                  } else {
                    previousResult = [newInboxMsgSubscribe, ...previousResult];
                  }

                  if (
                    sessionStorage.getItem("page") === "inbox" &&
                    sessionStorage.getItem("pid") ===
                      newInboxMsgSubscribe.chatID
                  ) {
                    //TODO: MARK SEEN HERE
                    console.log(previousResult[chatIndex]);
                    previousResult[chatIndex].unSeenCount = 0;
                  } else {
                    console.log(previousResult[chatIndex]);
                    previousResult[chatIndex].unSeenCount = 1;
                  }
                }

                return { getInbox: [...previousResult] };
              }
            });
          }

          if (!this.unsubscribe2) {
            this.unsubscribe2 = subscribeToMore({
              document: MESSAGE_ACTION_SUB,
              updateQuery: (prev, { subscriptionData }) => {
                const { messageActionSubsubscribe } = subscriptionData.data;
                if (!messageActionSubsubscribe) {
                  return prev;
                }
                const newData = produce(prev.getInbox, draftState => {
                  const chatIndex = draftState.findIndex(
                    el => el.chatID === messageActionSubsubscribe.chatID
                  );

                  if (!messageActionSubsubscribe.seenBy && chatIndex > -1) {
                    if (messageActionSubsubscribe.isTyping) {
                      if (!draftState[chatIndex].typingList) {
                        draftState[chatIndex].typingList = [
                          messageActionSubsubscribe.name
                        ];
                      } else {
                        draftState[chatIndex].typingList.push(
                          messageActionSubsubscribe.name
                        );
                      }
                    } else if (draftState[chatIndex].typingList) {
                      draftState[chatIndex].typingList = draftState[
                        chatIndex
                      ].typingList.filter(function(elem, i, rep) {
                        return (
                          i !== rep.indexOf(messageActionSubsubscribe.name)
                        );
                      });
                    }
                    if (draftState[chatIndex].typingList) {
                      switch (draftState[chatIndex].typingList.length) {
                        case 0:
                          draftState[chatIndex].typingText = null;
                          break;
                        case 1:
                          draftState[chatIndex].typingText =
                            draftState[chatIndex].typingList[0] +
                            " is typing...";
                          break;
                        default:
                          draftState[chatIndex].typingText =
                            "Members are typing...";
                          break;
                      }
                    }
                  }
                });
                {
                  /* if (
                    sessionStorage.getItem("page") === "inbox" &&
                    sessionStorage.getItem("pid") ===
                      messageActionSubsubscribe.chatID
                  ) {
                    //TODO: MARK SEEN HERE
                    console.log(previousResult[chatIndex]);
                    previousResult[chatIndex].unSeenCount = 0;
                  } else {
                    console.log(previousResult[chatIndex]);
                    previousResult[chatIndex].unSeenCount = 1;
                  } */
                }

                return { getInbox: [...newData] };
              }
            });
          }

          let messages = data.getInbox || [];

          if (error) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getInbox"}
                userID={currentuser.userID}
              />
            );
          }

          return (
            <div className="col-md-4 col-lg-3 col-xl-3">
              <div className="left">
                <InboxSearchTextBox
                  t={t}
                  handleSearchTextChange={e =>
                    this.handleSearchTextChange(refetch, e)
                  }
                />
                <InboxList
                  t={t}
                  messages={messages}
                  fetchData={() => this.fetchData(fetchMore)}
                  openChat={openChat}
                  currentuser={currentuser}
                  searchTerm={searchTerm}
                />
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default InboxPanel;
