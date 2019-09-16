import React, { Component } from "react";
import InboxSearchTextBox from "./InboxSearchTextBox";
import { GET_INBOX } from "../../../queries";
import { Query } from "react-apollo";
import Spinner from "../../common/Spinner";
import InboxList from "./InboxList";

class InboxPanel extends Component {
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
    const {
      readChat,
      currentuser,
      t,
      ErrorHandler,
      chatOpen,
      chatID
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
          //unSeenCount is reset to 1 here. Even though API sent 0
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
                  limit={parseInt(process.env.REACT_APP_INBOXLIST_LIMIT)}
                  chatID={chatID}
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
