import React, { Component } from "react";
import InboxSearchTextBox from "./InboxSearchTextBox";
import { GET_INBOX, NEW_INBOX_SUB } from "../../../queries";
import { Query } from "react-apollo";
import Spinner from "../../common/Spinner";
import InboxList from "./InboxList";
import { Waypoint } from "react-waypoint";
import { INBOXLIST_LIMIT } from "../../../docs/consts";

class InboxPanel extends Component {
  unsubscribe = null;
  state = { searchTerm: "", skip: 0 };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.chatOpen !== nextProps.chatOpen ||
      this.state.searchTerm !== nextState.searchTerm
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  handleSearchTextChange = (refetch, e) => {
    if (this.mounted) {
      if (e.target.value === "") refetch();
      this.setState({ skip: 0, searchTerm: e.target.value });
    }
  };

  handleEnd = ({ previousPosition, fetchMore }) => {
    const { skip } = this.state;

    if (previousPosition === Waypoint.below) {
      if (this.mounted) {
        this.setState(
          state => ({ skip: skip + INBOXLIST_LIMIT, loading: true }),
          () => this.fetchData(fetchMore)
        );
      }
    }
  };

  fetchData = fetchMore => {
    if (this.mounted) {
      this.setState({ loading: true }, () =>
        fetchMore({
          variables: {
            skip: this.state.skip,
            limit: INBOXLIST_LIMIT
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
    const { readChat, currentuser, t, ErrorHandler, chatOpen } = this.props;
    const { searchTerm, skip } = this.state;

    return (
      <Query
        query={GET_INBOX}
        variables={{ skip, limit: INBOXLIST_LIMIT }}
        fetchPolicy="cache-first"
      >
        {({ data, loading, error, subscribeToMore, fetchMore, refetch }) => {
          if (loading) {
            return (
              <div className="col-md-4 col-lg-3 col-xl-3">
                <div className="left">
                  <InboxSearchTextBox
                    t={t}
                    handleSearchTextChange={e =>
                      this.handleSearchTextChange(refetch, e)
                    }
                  />
                  <Spinner page="inbox" title={t("allmems")} />
                </div>
              </div>
            );
          }

          if (!this.unsubscribe) {
            this.unsubscribe = subscribeToMore({
              document: NEW_INBOX_SUB,
              updateQuery: (prev, { subscriptionData }) => {
                let { newInboxMsgSubscribe } = subscriptionData.data;

                if (!newInboxMsgSubscribe) {
                  return prev;
                }

                if (prev.getInbox) {
                  const chatIndex = prev.getInbox.findIndex(
                    el => el.chatID === newInboxMsgSubscribe.chatID
                  );

                  if (
                    sessionStorage.getItem("page") === "inbox" &&
                    sessionStorage.getItem("pid") ===
                      newInboxMsgSubscribe.chatID
                  ) {
                    newInboxMsgSubscribe.unSeenCount = 0;
                  }

                  if (chatIndex > -1) {
                    prev.getInbox[chatIndex] = newInboxMsgSubscribe;
                  } else {
                    prev.getInbox = [newInboxMsgSubscribe, ...prev.getInbox];
                  }
                }
                return prev.getInbox;
              }
            });
          }
          let messages = data.getInbox;

          if (error || !messages) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getInbox"}
                userID={currentuser.userID}
              />
            );
          }

          if (searchTerm !== "") {
            messages = messages.filter(msg =>
              msg.participants[0].profileName
                .toLocaleLowerCase()
                .startsWith(searchTerm.toLocaleLowerCase())
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
                <InboxList
                  messages={messages}
                  readChat={readChat}
                  currentuser={currentuser}
                  handleEnd={previousPosition =>
                    this.handleEnd({ previousPosition, fetchMore })
                  }
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
