import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { GET_INBOX } from "../../queries";
import { List, Avatar, Badge, Divider } from "antd";
import Waypoint from "react-waypoint";
import Chatroom from "../Chat/Chatroom";
import TimeAgo from "../common/TimeAgo";
import Error from "../common/Error";
import Spinner from "../common/Spinner";

const LIMIT = 10;

class InboxPage extends Component {
  state = { chatID: null };

  fetchData = fetchMore => {
    this.setState({ loading: true });
    fetchMore({
      variables: {
        limit: LIMIT,
        skip: this.state.skip
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.searchEvents.length === 0) {
          return previousResult;
        }
        //if there are events from last date in new fetch add them to old list
        if (
          previousResult.searchEvents[previousResult.searchEvents.length - 1]
            .date ===
          fetchMoreResult.searchEvents[fetchMoreResult.searchEvents.length - 1]
            .date
        ) {
          previousResult.searchEvents[
            previousResult.searchEvents.length - 1
          ].events = previousResult.searchEvents[
            previousResult.searchEvents.length - 1
          ].events.concat(
            fetchMoreResult.searchEvents[
              fetchMoreResult.searchEvents.length - 1
            ].events
          );
          //remove the pushed events from the fetch list
          fetchMoreResult.searchEvents.pop();
        }

        return {
          searchEvents: [
            ...previousResult.searchEvents,
            ...fetchMoreResult.searchEvents
          ]
        };
      }
    });

    this.setState({
      loading: false
    });
  };

  setChatID = (e, chatID) => {
    e.preventDefault();
    this.setState({ chatID });
  };

  handleEnd = (previousPosition, fetchMore) => {
    if (previousPosition === Waypoint.below) {
      this.setState(
        state => ({ skip: this.state.skip + LIMIT }),
        () => this.fetchData(fetchMore)
      );
    }
  };

  renderItem = (item, timeAgo) => {
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={
            <Badge dot={timeAgo === "Online"}>
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </Badge>
          }
          title={
            <a onClick={e => this.setChatID(e, item.chatID)}>{item.fromUser}</a>
          }
          description={item.text}
        />
        <div>{timeAgo}</div>
      </List.Item>
    );
  };

  renderMsgList = ({ messages, onlineOnly }) => {
    return (
      <Fragment>
        {messages.map(message => {
          var timeAgo = TimeAgo(message);
          if (onlineOnly) {
            if (timeAgo === "Online") {
              return this.renderItem(message, timeAgo);
            }
            return null;
          } else if (timeAgo !== "Online") {
            return this.renderItem(message, timeAgo);
          }
          return null;
        })}
      </Fragment>
    );
  };

  render() {
    const { chatID } = this.state;
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "horizontal" }}>
        <Query query={GET_INBOX} fetchPolicy="cache-and-network">
          {({ data, loading, error, subscribeToMore }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            }
            if (error) {
              return <Error error={error} />;
            }

            const messages = data.getInbox;

            if (!messages || messages.length === 0) {
              return <div>No Messages Available</div>;
            }
            return (
              <div style={{ display: "contents" }}>
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
                    <Divider orientation="left">Online</Divider>
                    {this.renderMsgList({ messages, onlineOnly: true })}
                    <Divider />
                    {this.renderMsgList({ messages, onlineOnly: false })}
                    {/* <Waypoint
                      onEnter={({ previousPosition }) =>
                        this.handleEnd(previousPosition, fetchMore)
                      }
                    /> */}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 4,
                    flexDirection: "horizontal",
                    backgroundColor: "blue"
                  }}
                >
                  {" "}
                  <Chatroom
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column"
                    }}
                    chatID={chatID !== null ? chatID : messages[0].chatID}
                  />
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default InboxPage;
