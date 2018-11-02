import React, { Component, Fragment } from "react";
import { Query } from "react-apollo";
import { GET_INBOX, OPEN_CHAT } from "../../queries";
import { Tabs, List, Avatar, Icon } from "antd";
import Waypoint from "react-waypoint";
import Chatroom from "../Chat/Chatroom";

const TabPane = Tabs.TabPane;
const LIMIT = 10;

class InboxPage extends Component {
  state = { chatID: "5bd9d9e68eda5a5664d6b4d2" };

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
            <a onClick={e => this.setChatID(e, item.chatID)}>
              {item.fromUser.username}
            </a>
          }
          description={item.text}
        />
        <div>
          <Icon type="ellipsis" theme="outlined" />
        </div>
      </List.Item>
    );
  };

  render() {
    const { chatID } = this.state;
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "horizontal" }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "horizontal",
            backgroundColor: "red"
          }}
        >
          <Query query={GET_INBOX} fetchPolicy="no-cache">
            {({ data, loading, error, fetchMore }) => {
              const messages = data.getInbox;
              if (loading) {
                return <div>loading</div>;
              } else if (messages === undefined || messages.length === 0) {
                return <div>No Messages Available</div>;
              }

              if (error) {
                return <div>Error: {error.message}</div>;
              }
              return (
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
                      <Fragment>
                        {messages.map(message => {
                          return this.renderItem(message);
                        })}
                      </Fragment>
                    </TabPane>
                    <TabPane tab="New" key="2">
                      Online
                    </TabPane>
                    <TabPane tab="Online" key="3">
                      Pop
                    </TabPane>
                  </Tabs>

                  {/* <Waypoint
                      onEnter={({ previousPosition }) =>
                        this.handleEnd(previousPosition, fetchMore)
                      }
                    /> */}
                </div>
              );
            }}
          </Query>
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
          <Query
            query={OPEN_CHAT}
            variables={{ chatID }}
            fetchPolicy="no-cache"
          >
            {({ data, loading, error, fetchMore }) => {
              if (loading) {
                return (
                  <Chatroom
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column"
                    }}
                    loading={true}
                  />
                );
              }

              if (error) {
                return <div>Error: {error.message}</div>;
              }

              return (
                <Chatroom
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column"
                  }}
                  messages={data.openChat.messages}
                />
              );
            }}
          </Query>
        </div>
      </div>
    );
  }
}

export default InboxPage;
