import React, { Component } from "react";
import { Menu, Avatar, Button, Checkbox, message } from "antd";
import Waypoint from "react-waypoint";
import {
  INVITE_PROFILES,
  INVITE_PROFILES_EVENT,
  REMOVE_PROFILES_EVENT,
  GET_EVENT
} from "../../queries";
import { Mutation } from "react-apollo";

const LIMIT = 5;
class MembersList extends Component {
  state = {
    skip: 0,
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
        if (!fetchMoreResult || fetchMoreResult.getMembers.length === 0) {
          return previousResult;
        }
        previousResult.getMembers = [
          ...fetchMoreResult.getMembers,
          ...previousResult.getMembers
        ];

        return previousResult;
      }
    });
  };

  handleInvite = invite => {
    const { targetType, close } = this.props;
    if (targetType === "event") {
      invite()
        .then(({ data }) => {
          if (data.inviteProfileEvent) {
            close();
            message.success("Inivitations sent");
          }
        })
        .catch(res => {
          console.error(res);
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    } else {
      invite()
        .then(({ data }) => {
          if (data.inviteProfile) {
            close();
            message.success("Inivitations sent");
          }
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    }
  };

  handleRemove = remove => {
    const { targetType, close } = this.props;
    if (targetType === "event") {
      remove()
        .then(({ data }) => {
          if (data.removeProfileEvent) {
            close();
            message.success("Members removed");
          }
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    } else {
      remove()
        .then(({ data }) => {
          if (data.removeProfile) {
            close();
            message.success("Removed profiles");
          }
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    }
  };

  handleChange = e => {
    let { invitedProfiles } = this.state;
    if (e.target.checked) {
      invitedProfiles.push(e.target.value);
    } else {
      invitedProfiles = invitedProfiles.filter(pro => pro !== e.target.value);
    }

    this.setState({ invitedProfiles });
  };

  updateAttend = (cache, { data: { removeProfileEvent } }) => {
    const { invitedProfiles } = this.state;
    const { targetID } = this.props;

    const { event } = cache.readQuery({
      query: GET_EVENT,
      variables: { id: targetID }
    });

    cache.writeQuery({
      query: GET_EVENT,
      variables: { id: targetID },
      data: {
        event: {
          ...event,
          participants: event.participants.filter(
            member => !invitedProfiles.includes(member.id)
          )
        }
      }
    });
  };

  handleFriendList = ({ members }) => (
    <Menu>
      <Menu.Divider />
      {members.map(friend => (
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
              <Checkbox onChange={this.handleChange} value={friend.id}>
                Checkbox
              </Checkbox>{" "}
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />{" "}
            </div>
            <div>
              <div>{friend.profileName}</div>
            </div>
          </div>
        </Menu.Item>
      ))}
      {this.props.listType === "friends" && (
        <Waypoint
          onEnter={({ previousPosition }) => this.handleEnd(previousPosition)}
        />
      )}
    </Menu>
  );
  actionButton = ({ targetID, invitedProfiles, targetType, listType }) => {
    if (targetType === "event" && listType === "friends") {
      return (
        <Mutation
          mutation={INVITE_PROFILES_EVENT}
          variables={{
            eventID: targetID,
            invitedProfiles
          }}
        >
          {inviteProfileEvent => {
            return (
              <Button onClick={() => this.handleInvite(inviteProfileEvent)}>
                Invite Members
              </Button>
            );
          }}
        </Mutation>
      );
    } else if (targetType === "event" && listType === "participants") {
      return (
        <Mutation
          mutation={REMOVE_PROFILES_EVENT}
          variables={{
            eventID: targetID,
            removedProfiles: invitedProfiles
          }}
          update={this.updateAttend}
        >
          {removeProfileEvent => {
            return (
              <Button onClick={() => this.handleRemove(removeProfileEvent)}>
                Remove Members
              </Button>
            );
          }}
        </Mutation>
      );
    } else {
      return (
        <Mutation
          mutation={INVITE_PROFILES}
          variables={{
            chatID: targetID,
            invitedProfiles
          }}
        >
          {inviteProfile => {
            return (
              <Button onClick={() => this.handleInvite(inviteProfile)}>
                Invite Members
              </Button>
            );
          }}
        </Mutation>
      );
    }
  };

  render() {
    const { members, targetID, targetType, listType } = this.props;
    const { invitedProfiles } = this.state;
    const membersList = this.handleFriendList({ members });
    const actionButton = this.actionButton({
      targetID,
      invitedProfiles,
      targetType,
      listType
    });
    return (
      <div>
        <div>
          {listType === "participants" ? "Remove Members" : "Invite Members"}
        </div>
        <div
          style={{
            height: "19vh",
            overflow: "hidden",
            overflowY: "scroll",
            backgroundColor: "#fff"
          }}
        >
          {membersList}
        </div>
        <div style={{ height: "2vh", backgroundColor: "#fff" }}>
          {" "}
          {actionButton}
        </div>
      </div>
    );
  }
}

export default MembersList;
