import React, { Component } from "react";
import InboxSearchTextBox from "./InboxSearchTextBox";
import {
  READ_CHAT,
  GET_INBOX,
  GET_COUNTS,
  NEW_INBOX_SUB
} from "../../../queries";
import { Query, Mutation, withApollo } from "react-apollo";
import Spinner from "../../common/Spinner";
import InboxList from "./InboxList";
import deleteFromCache from "../../../utils/deleteFromCache";
const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT);
class InboxPanel extends Component {
  unsubscribe = null;
  state = { searchTerm: "", skip: 0, unSeenCount: 0 };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.chatOpen !== nextProps.chatOpen ||
      this.props.chatID !== nextProps.chatID ||
      this.state.searchTerm !== nextState.searchTerm ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    window.addEventListener("beforeunload", () => {
      this.markChatRead(this.readChat);
    });
    this.mounted = true;
  }
  componentWillUnmount() {
    this.markChatRead(this.readChat);
    this.unsubscribe();
    this.mounted = false;
  }

  handleSearchTextChange = (refetch, e) => {
    if (this.mounted) {
      if (e.target.value === "") refetch();
      this.setState({ skip: 0, searchTerm: e.target.value });
    }
  };

  handleChatClick = (chatID, unSeenCount, readChat) => {
    if (chatID === this.props.chatID || !chatID) {
      return;
    }
    if (!this.opening) {
      const { ErrorHandler } = this.props;
      this.opening = true;
      ErrorHandler.setBreadcrumb("Open Chat:" + chatID);
      if (this.mounted) {
        const { cache } = this.props.client;
        deleteFromCache({ cache, query: "getMessages" });
        this.setState({ unSeenCount, chatID, chatOpen: true }, () => {
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
        this.props.history.replace({ state: { chatID } });
      }
    }
  };

  markChatRead = readChat => {
    if (this.props.chatID) {
      readChat()
        .then(() => {
          this.props.ReactGA.event({
            category: "Chat",
            action: "Read"
          });
          this.opening = false;
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
          this.opening = false;
        });
    }
  };

  updateCount = cache => {
    const { unSeenCount, chatID } = this.state;
    const { getCounts } = cache.readQuery({
      query: GET_COUNTS
    });
    let newCounts = { ...getCounts };

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
    let newData = Array.from(getInbox);

    const chatIndex = newData.findIndex(chat => chat.chatID === chatID);

    if (chatIndex > -1) {
      newData[chatIndex].unSeenCount = 0;
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
    const { currentuser, t, ErrorHandler, chatOpen, chatID } = this.props;
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
                    previousResult[chatIndex].unSeenCount = 0;
                  }
                }

                return { getInbox: [...previousResult] };
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
              <div className={chatOpen ? "left hide" : "left"}>
                <InboxSearchTextBox
                  t={t}
                  handleSearchTextChange={e =>
                    this.handleSearchTextChange(refetch, e)
                  }
                />
                <Mutation
                  mutation={READ_CHAT}
                  variables={{ chatID: chatID ? chatID : null }}
                  update={this.updateCount}
                >
                  {readChat => {
                    this.readChat = readChat;
                    return (
                      <InboxList
                        t={t}
                        messages={messages}
                        fetchData={() => this.fetchData(fetchMore)}
                        readChat={(id, unSeenCount) =>
                          this.handleChatClick(id, unSeenCount, readChat)
                        }
                        currentuser={currentuser}
                        searchTerm={searchTerm}
                      />
                    );
                  }}
                </Mutation>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(InboxPanel);
