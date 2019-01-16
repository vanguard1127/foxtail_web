import React, { Component } from "react";
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
    const { targetType, close, t } = this.props;
    if (targetType === "event") {
      invite()
        .then(({ data }) => {
          if (data.inviteProfileEvent) {
            close();
            alert(t("common:invitesent"));
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
            alert(t("common:invitesent"));
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
    const { targetType, close, t } = this.props;
    if (targetType === "event") {
      remove()
        .then(({ data }) => {
          if (data.removeProfileEvent) {
            close();
            alert(t("common:memsremove"));
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
            alert(t("common:removpros"));
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

  updateAttend = cache => {
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

  handleFriendList = ({ members, t }) => (
    <div>
      <hr />
      {members.map(friend => (
        <div key={friend.id}>
          <div
            style={{
              display: "flex",
              backgroundColor: "#eee",
              width: "35vw"
            }}
          >
            {" "}
            <div>
              <input
                type="checkbox"
                onChange={this.handleChange}
                checked={friend.id ? true : false}
              />
              {t("common:checkbox")}{" "}
              <img
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt=""
              />{" "}
            </div>
            <div>
              <div>{friend.profileName}</div>
            </div>
          </div>
        </div>
      ))}
      {this.props.listType === "friends" && (
        <Waypoint
          onEnter={({ previousPosition }) => this.handleEnd(previousPosition)}
        />
      )}
    </div>
  );
  actionButton = ({ targetID, invitedProfiles, targetType, listType, t }) => {
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
              <button onClick={() => this.handleInvite(inviteProfileEvent)}>
                {t("common:invitemems")}
              </button>
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
              <button onClick={() => this.handleRemove(removeProfileEvent)}>
                {t("common:removmems")}
              </button>
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
              <button onClick={() => this.handleInvite(inviteProfile)}>
                {t("common:invitemems")}
              </button>
            );
          }}
        </Mutation>
      );
    }
  };

  render() {
    const { members, targetID, targetType, listType, t } = this.props;
    const { invitedProfiles } = this.state;
    const membersList = this.handleFriendList({ members, t });
    const actionButton = this.actionButton({
      targetID,
      invitedProfiles,
      targetType,
      listType,
      t
    });
    return (
      <div>
        <div>
          {listType === "participants"
            ? t("common:removmems")
            : t("common:invitemems")}
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
