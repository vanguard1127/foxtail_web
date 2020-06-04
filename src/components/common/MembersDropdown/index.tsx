import React, { memo, createRef, useEffect } from "react";
import { WithT } from "i18next";

import {
  GET_CHAT_PARTICIPANTS,
  GET_EVENT_PARTICIPANTS
} from "queries";

import FriendsList from './FriendsList';
import ParticipantsList from "./ParticipantsList";

import "./membersDropdown.css";

interface IMembersDropdown extends WithT {
  close: () => void;
  targetType: string;
  targetID: string;
  listType: string;
  isOwner?: boolean;
}

const MembersDropdown: React.FC<IMembersDropdown> = memo(({
  close,
  targetType,
  targetID,
  listType,
  isOwner = false,
  t,
}) => {
  const wrapperRef = createRef<HTMLDivElement>();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    }
  }, []);

  const handleClickOutside = event => {
    if (wrapperRef && !wrapperRef.current.contains(event.target)) {
      close();
    }
  };

  if (listType === "friends") {
    return (
      <FriendsList
        targetID={targetID}
        targetType={targetType}
        listType={listType}
        ref={wrapperRef}
        t={t}
      />
    );
  } else if (listType === "participants" && targetType === "chat") {
    return (
      <ParticipantsList
        query={GET_CHAT_PARTICIPANTS}
        listType={listType}
        targetID={targetID}
        targetType={targetType}
        isOwner={isOwner}
        ref={wrapperRef}
        t={t}
      />
    );
  } else if (listType === "participants" && targetType === "event") {
    return (
      <ParticipantsList
        query={GET_EVENT_PARTICIPANTS}
        listType={listType}
        targetID={targetID}
        targetType={targetType}
        isOwner={isOwner}
        ref={wrapperRef}
        t={t}
      />
    )
  }
  return null;
});

export default MembersDropdown;
