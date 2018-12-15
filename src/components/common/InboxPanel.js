import React, { Component, Fragment } from "react";
import { Input } from "antd";
import { GET_INBOX } from "../../queries";
import { Query } from "react-apollo";
import Spinner from "./Spinner";
import InboxList from "./InboxList";

class InboxPanel extends Component {
  //Variables by text
  render() {
    const { setChatID } = this.props;
    return (
      <Fragment>
        <Query query={GET_INBOX} fetchPolicy="cache-and-network">
          {({ data, loading, error, subscribeToMore }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            }
            if (!data.getInbox) {
              return <div>No messages</div>;
            }

            const messages = data.getInbox;
            if (!messages || messages.length === 0) {
              return <div>No Messages Available</div>;
            }

            return (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "horizontal",
                  backgroundColor: "red"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    backgroundColor: "lightblue",
                    padding: "10px"
                  }}
                >
                  <div>
                    <Input placeholder={"Search name"} />
                  </div>
                  <InboxList messages={messages} setChatID={setChatID} />
                </div>
              </div>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default InboxPanel;
