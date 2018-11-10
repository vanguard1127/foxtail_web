import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { GET_INBOX } from "../../queries";
import { Tabs, List, Avatar } from "antd";
import Waypoint from "react-waypoint";
import Chatroom from "../Chat/Chatroom";
import moment from "moment";

const TabPane = Tabs.TabPane;
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

  renderItem = item => {
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title={
            <a onClick={e => this.setChatID(e, item.chatID)}>{item.fromUser}</a>
          }
          description={item.text}
        />
        <div>
          {moment(item.createdAt)
            .format("MMM Do")
            .toString()}
        </div>
      </List.Item>
    );
  };

  renderMsgList = messages => {
    return (
      <Fragment>
        {messages.map(message => {
          return this.renderItem(message);
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
              return <div>loading</div>;
            }

            if (error) {
              return <div>Error: {error.message}</div>;
            }

            const messages = data.getInbox;
            console.log("SHOU", messages, "CHH", chatID);
            if (messages === undefined || messages.length === 0) {
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
                    <Tabs defaultActiveKey="1">
                      <TabPane tab="All" key="1">
                        {this.renderMsgList(messages)}
                      </TabPane>
                      <TabPane tab="Online" key="2">
                        Online
                      </TabPane>
                    </Tabs>

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
