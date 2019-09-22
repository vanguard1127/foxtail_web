import React, { PureComponent } from "react";
import { Waypoint } from "react-waypoint";
import {
  INVITE_PROFILES,
  INVITE_PROFILES_EVENT,
  REMOVE_PROFILES_EVENT,
  REMOVE_PROFILES_CHAT,
  GET_CHAT_PARTICIPANTS,
  GET_EVENT
} from "../../../queries";
import { Mutation } from "react-apollo";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { preventContextMenu } from "../../../utils/image";

class MembersList extends PureComponent {
  state = {
    skip: 0,
    invitedProfiles: []
  };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  handleEnd = previousPosition => {
    //if total reach skip and show no more sign
    const { skip } = this.state;
    if (previousPosition === Waypoint.below) {
      const { fetchMore } = this.props;
      if (this.mounted) {
        this.setState(
          state => ({
            skip: skip + parseInt(process.env.REACT_APP_MEMSLIST_LIMIT)
          }),
          () => this.fetchData(fetchMore)
        );
      }
    }
  };

  fetchData = fetchMore => {
    if (this.mounted) {
      this.setState({ loading: true });

      fetchMore({
        variables: {
          skip: this.state.skip,
          limit: parseInt(process.env.REACT_APP_MEMSLIST_LIMIT)
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
    }
  };

  handleInvite = invite => {
    const { targetType, close, t, ReactGA } = this.props;
    if (targetType === "event") {
      invite()
        .then(({ data }) => {
          if (data.inviteProfileEvent) {
            ReactGA.event({
              category: "Event",
              action: "Invites Sent"
            });
            close();
            toast.success(t("common:invitesent"));
          }
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    } else {
      invite()
        .then(({ data }) => {
          if (data.inviteProfile) {
            ReactGA.event({
              category: "Chat",
              action: "Invites Sent"
            });
            close();
            toast.success(t("common:invitesent"));
          }
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    }
  };

  handleRemove = remove => {
    const { targetType, close, t, ReactGA } = this.props;
    if (targetType === "event") {
      remove()
        .then(({ data }) => {
          if (data.removeProfileEvent) {
            ReactGA.event({
              category: "Event",
              action: "Remove Member"
            });
            close();
            toast.success(t("common:memsremove"));
          }
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    } else {
      remove()
        .then(({ data }) => {
          if (data.removeProfilesChat) {
            ReactGA.event({
              category: "Chat",
              action: "Remove Member"
            });
            close();
            toast.success(t("common:removpros"));
          }
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    }
  };

  handleChange = e => {
    let { invitedProfiles } = this.state;

    if (e.target.checked) {
      invitedProfiles = [...invitedProfiles, e.target.value];
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

  updateChatParticipants = cache => {
    const { invitedProfiles } = this.state;
    const { targetID } = this.props;

    const { chat } = cache.readQuery({
      query: GET_CHAT_PARTICIPANTS,
      variables: { chatID: targetID }
    });

    cache.writeQuery({
      query: GET_CHAT_PARTICIPANTS,
      variables: { chatID: targetID },
      data: {
        chat: {
          ...chat,
          participants: chat.participants.filter(
            member => !invitedProfiles.includes(member.id)
          )
        }
      }
    });
  };

  handleFriendList = ({ members, t }) => (
    <>
      {members.map(el => (
        <div className="inv-item" key={el.id}>
          {this.props.showActionButton && (
            <div className="select-checkbox">
              <input
                type="checkbox"
                id={el.id}
                onChange={this.handleChange}
                value={el.id}
              />
              <label htmlFor={el.id} className="label">
                <span />
              </label>
            </div>
          )}
          <NavLink to={"/member/" + el.id}>
            <div className="avatar">
              <div>
                <img src={el.profilePic} alt="" />
              </div>
            </div>
            <span className="username">{el.profileName}</span>
          </NavLink>
        </div>
      ))}
      {this.props.listType === "friends" && (
        <Waypoint
          onEnter={({ previousPosition }) => this.handleEnd(previousPosition)}
        />
      )}
    </>
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
              <div
                className="apply-content"
                onClick={() => this.handleInvite(inviteProfileEvent)}
              >
                <span> {t("common:invite")}</span>
              </div>
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
              <div
                className="apply-content"
                onClick={() => this.handleRemove(removeProfileEvent)}
              >
                <span> {t("common:remove")}</span>
              </div>
            );
          }}
        </Mutation>
      );
    } else if (targetType === "chat" && listType === "participants") {
      return (
        <Mutation
          mutation={REMOVE_PROFILES_CHAT}
          variables={{
            chatID: targetID,
            removedProfiles: invitedProfiles
          }}
          update={this.updateChatParticipants}
        >
          {removeProfileChat => {
            return (
              <div
                className="apply-content"
                onClick={() => this.handleRemove(removeProfileChat)}
              >
                <span> {t("common:remove")}</span>
              </div>
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
              <div
                className="apply-content"
                onClick={() => this.handleInvite(inviteProfile)}
              >
                <span> {t("common:invite")}</span>
              </div>
            );
          }}
        </Mutation>
      );
    }
  };

  render() {
    const {
      members,
      targetID,
      targetType,
      listType,
      t,
      showActionButton
    } = this.props;
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
      <div onContextMenu={preventContextMenu}>
        {" "}
        {membersList}
        <div style={{ height: "2vh", backgroundColor: "#fff" }}>
          {showActionButton && actionButton}
        </div>
      </div>
    );
  }
}

export default MembersList;
