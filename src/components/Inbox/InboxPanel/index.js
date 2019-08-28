import React, { Component } from "react";
import InboxSearchTextBox from "./InboxSearchTextBox";
import { GET_INBOX } from "../../../queries";
import { Query } from "react-apollo";
import Spinner from "../../common/Spinner";
import InboxList from "./InboxList";
import { INBOXLIST_LIMIT } from "../../../docs/consts";

class InboxPanel extends Component {
  unsubscribe = null;
  state = { searchTerm: "", skip: 0 };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.chatOpen !== nextProps.chatOpen ||
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
                <InboxList
                  t={t}
                  messages={messages}
                  subscribeToMore={subscribeToMore}
                  fetchMore={fetchMore}
                  readChat={readChat}
                  currentuser={currentuser}
                  searchTerm={searchTerm}
                  limit={INBOXLIST_LIMIT}
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
