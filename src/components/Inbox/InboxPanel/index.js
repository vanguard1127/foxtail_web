import React, { Component } from "react";
import InboxSearchTextBox from "./InboxSearchTextBox";
import { READ_CHAT, GET_INBOX, GET_COUNTS } from "../../../queries";
import { Query, Mutation, withApollo } from "react-apollo";
import Spinner from "../../common/Spinner";
import InboxList from "./InboxList";
import deleteFromCache from "../../../utils/deleteFromCache";

class InboxPanel extends Component {
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

  handleChatClick = (chatID, unSeenCount, readChat) => {
    if (chatID === this.props.chatID) {
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
      query: GET_INBOX,
      variables: {
        limit: parseInt(process.env.REACT_APP_INBOXLIST_LIMIT),
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
          limit: parseInt(process.env.REACT_APP_INBOXLIST_LIMIT),
          skip: 0
        },
        data: {
          getInbox: [...newData]
        }
      });
    }
  };

  render() {
    const {
      currentuser,
      t,
      ErrorHandler,
      chatOpen,
      chatID,
      client
    } = this.props;
    const { searchTerm, skip } = this.state;

    return (
      <Query
        query={GET_INBOX}
        variables={{
          skip,
          limit: parseInt(process.env.REACT_APP_INBOXLIST_LIMIT)
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
                  variables={{ chatID }}
                  update={this.updateCount}
                >
                  {readChat => {
                    return (
                      <InboxList
                        t={t}
                        messages={messages}
                        subscribeToMore={subscribeToMore}
                        fetchMore={fetchMore}
                        readChat={(id, unSeenCount) =>
                          this.handleChatClick(id, unSeenCount, readChat)
                        }
                        currentuser={currentuser}
                        searchTerm={searchTerm}
                        limit={parseInt(process.env.REACT_APP_INBOXLIST_LIMIT)}
                        chatID={chatID}
                        client={client}
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
