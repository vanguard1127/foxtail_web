import React, { useState } from "react";
import { Waypoint } from "react-waypoint";
import { Mutation } from "react-apollo";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { WithT } from "i18next";
import ReactGA from 'react-ga';

import * as ErrorHandler from 'components/common/ErrorHandler';

import {
  INVITE_PROFILES,
  INVITE_PROFILES_EVENT,
  REMOVE_PROFILES_EVENT,
  REMOVE_PROFILES_CHAT,
  GET_CHAT_PARTICIPANTS,
  GET_EVENT
} from "queries";

interface IMembersList extends WithT {
  members: any,
  fetchMore: any,
  targetID: string,
  listType: string,
  targetType: string,
  showActionButton: boolean,
  close: () => void,
}

const MembersList: React.FC<IMembersList> = ({
  members,
  fetchMore,
  targetID,
  listType,
  targetType,
  showActionButton,
  close,
  t,
}) => {
  const [state, setState] = useState({
    skip: 0,
    invitedProfiles: [],
    hasMore: true
  })

  const handleEnd = previousPosition => {
    //if total reach skip and show no more sign
    const { skip, hasMore } = state;
    if (previousPosition === Waypoint.below && hasMore) {
      setState({ ...state, skip: skip + parseInt(process.env.REACT_APP_MEMSLIST_LIMIT) })
      fetchData(fetchMore);
    }
  };

  const fetchData = fetchMore => {
    fetchMore({
      variables: {
        skip: state.skip,
        limit: parseInt(process.env.REACT_APP_MEMSLIST_LIMIT)
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.getFriends.length === 0) {
          setState({ ...state, hasMore: false });
          return previousResult;
        }
        const prevResult = [
          ...previousResult.getFriends,
          ...fetchMoreResult.getFriends
        ];
        return { getFriends: [...prevResult] };
      }
    });
  };

  const handleInvite = invite => {
    if (targetType === "event") {
      invite()
        .then(({ data }) => {
          if (data.inviteProfileEvent) {
            ReactGA.event({
              category: "Event",
              action: "Invites Sent"
            });
            toast.success(t("common:invitesent"));
            close();
          }
        })
        .catch(res => {
          ErrorHandler.catchErrors(res);
        });
    } else {
      invite()
        .then(({ data }) => {
          if (data.inviteProfile) {
            ReactGA.event({
              category: "Chat",
              action: "Invites Sent"
            });
            toast.success(t("common:invitesent"));
            close();
          }
        })
        .catch(res => {
          ErrorHandler.catchErrors(res);
        });
    }
  };

  const handleRemove = remove => {
    if (targetType === "event") {
      remove()
        .then(({ data }) => {
          if (data.removeProfileEvent) {
            ReactGA.event({
              category: "Event",
              action: "Remove Member"
            });
            toast.success(t("common:memsremove"));
            close();
          }
        })
        .catch(res => {
          ErrorHandler.catchErrors(res);
        });
    } else {
      remove()
        .then(({ data }) => {
          if (data.removeProfilesChat) {
            ReactGA.event({
              category: "Chat",
              action: "Remove Member"
            });
            toast.success(t("common:removpros"));
            close();
          }
        })
        .catch(res => {
          ErrorHandler.catchErrors(res);
        });
    }
  };

  const handleChange = e => {
    let invitedProfiles = state.invitedProfiles;

    if (e.target.checked) {
      invitedProfiles = [...invitedProfiles, e.target.value];
    } else {
      invitedProfiles = invitedProfiles.filter(pro => pro !== e.target.value);
    }

    setState({ ...state, invitedProfiles });
  };

  const updateAttend = cache => {
    const { invitedProfiles } = state;

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

  const updateChatParticipants = cache => {
    const { invitedProfiles } = state;

    const { chat } = cache.readQuery({
      query: GET_CHAT_PARTICIPANTS,
      variables: {
        chatID: targetID,
        isMobile: sessionStorage.getItem("isMobile")
      }
    });

    cache.writeQuery({
      query: GET_CHAT_PARTICIPANTS,
      variables: {
        chatID: targetID,
        isMobile: sessionStorage.getItem("isMobile")
      },
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

  const handleFriendList = ({ members }) => (
    <div className="memberList">
      {members.map(el => (
        <div className="inv-item" key={el.id}>
          {showActionButton && (
            <div className="select-checkbox">
              <input
                type="checkbox"
                id={el.id}
                onChange={handleChange}
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
            <span className="username" title={el.profileName}>
              {el.profileName}
            </span>
          </NavLink>
        </div>
      ))}
      {listType === "friends" && (
        <div className="inv-item">
          <Waypoint
            onEnter={({ previousPosition }) => handleEnd(previousPosition)}
          />
        </div>
      )}
    </div>
  );
  const actionButton = ({ targetID, invitedProfiles, targetType, listType, t }) => {
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
                onClick={() => handleInvite(inviteProfileEvent)}
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
          update={updateAttend}
        >
          {removeProfileEvent => {
            return (
              <div
                className="apply-content"
                onClick={() => handleRemove(removeProfileEvent)}
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
          update={updateChatParticipants}
        >
          {removeProfileChat => {
            return (
              <div
                className="apply-content"
                onClick={() => handleRemove(removeProfileChat)}
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
                onClick={() => handleInvite(inviteProfile)}
              >
                <span> {t("common:invite")}</span>
              </div>
            );
          }}
        </Mutation>
      );
    }
  };

  const { invitedProfiles } = state;

  const membersList = handleFriendList({ members });
  const ActionButton = actionButton({
    targetID,
    invitedProfiles,
    targetType,
    listType,
    t
  });
  return (
    <>
      {membersList}
      <div style={{ height: "2vh", backgroundColor: "#fff" }}>
        {showActionButton && ActionButton}
      </div>
    </>
  );
}

export default MembersList;
