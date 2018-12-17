import React, { Component } from "react";
import { Menu, Avatar, Button } from "antd";
import Waypoint from "react-waypoint";
import { INVITE_PROFILES } from "../../queries";
import { Mutation } from "react-apollo";

const LIMIT = 5;
class FriendsList extends Component {
  state = {
    skip: 0,
    chatID: null,
    invitedProfiles: []
  };

  handleEnd = previousPosition => {
    //if totoal reach skip and show no more sign
    const { skip } = this.state;
    if (previousPosition === Waypoint.below) {
      const { fetchMore } = this.props;
      this.setState(
        state => ({ skip: skip + LIMIT }),
        () => this.fetchData(fetchMore)
      );
    }
  };

  fetchData = fetchMore => {
    this.setState({ loading: true });

    fetchMore({
      variables: {
        skip: this.state.skip,
        limit: LIMIT
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.getFriends.length === 0) {
          return previousResult;
        }
        previousResult.getFriends = [
          ...fetchMoreResult.getFriends,
          ...previousResult.getFriends
        ];

        return previousResult;
      }
    });
  };

  handleFriendList = ({ friends }) => (
    <Menu>
      <Menu.Divider />
      {friends.map(friend => (
        <Menu.Item key={friend.id}>
          <div
            style={{
              display: "flex",
              backgroundColor: "#eee",
              width: "35vw"
            }}
          >
            {" "}
            <div>
              {" "}
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />{" "}
            </div>
            <div>
              <div>{friend.profileName}</div>
            </div>
            <div style={{ display: "flex", float: "right" }}>
              <Button>Invite</Button>
            </div>
          </div>
        </Menu.Item>
      ))}
      <Waypoint
        onEnter={({ previousPosition }) => this.handleEnd(previousPosition)}
      />
      <Menu.Item disabled>No new friends :)</Menu.Item>
    </Menu>
  );
  actionButton = () => {
    const { chatID, invitedProfiles } = this.state;
    return (
      <Mutation
        mutation={INVITE_PROFILES}
        variables={{
          chatID,
          invitedProfiles
        }}
      >
        {inviteProfile => {
          return <Button onClick={inviteProfile}>Invite Members</Button>;
        }}
      </Mutation>
    );
  };

  render() {
    const { friends } = this.props;
    const friendsList = this.handleFriendList({ friends });
    return (
      <div>
        <div>Invite Members</div>
        <div
          style={{
            height: "19vh",
            overflow: "hidden",
            overflowY: "scroll",
            backgroundColor: "#fff"
          }}
        >
          {friendsList}
          <div style={{ height: "2vh", backgroundColor: "#fff" }}>
            {" "}
            {this.actionButton}
          </div>
        </div>
      </div>
    );
  }
}

export default FriendsList;
