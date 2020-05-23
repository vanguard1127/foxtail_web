import React, { useState, memo } from "react";
import { WithT } from "i18next";
import ReactGA from 'react-ga';

import * as ErrorHandler from 'components/common/ErrorHandler';
import MembersDropdown from "components/common/MembersDropdown/MembersDropdown";

interface IChatActionsProps extends WithT {
  chatID: string,
  participantsNum: number | null;
  isOwner?: boolean,
  setBlockModalVisible?: () => void,
  leaveDialog?: () => void,
}

const ChatActions: React.FC<IChatActionsProps> = memo(({
  chatID,
  setBlockModalVisible,
  isOwner,
  leaveDialog,
  participantsNum,
  t,
}) => {
  const [state, setState] = useState({
    invDropOpen: false,
    remDropOpen: false
  });
  const closeRemDropdown = () => {
    setState({ ...state, remDropOpen: false });
  }
  const closeInvDropdown = () => {
    setState({ ...state, invDropOpen: false });
  }

  return (
    <ul>
      <li
        className="members"
        onClick={() => setState({ ...state, remDropOpen: !state.remDropOpen })}
      >
        <span>
          {t("common:Participants") + " (" + participantsNum + ") "}
        </span>
      </li>
      {state.remDropOpen && (
        <MembersDropdown
          targetID={chatID}
          targetType={"chat"}
          listType={"participants"}
          close={closeRemDropdown}
          isOwner={isOwner}
          ErrorHandler={ErrorHandler}
          ReactGA={ReactGA}
          t={t}
        />
      )}
      <li
        className="invite"
        onClick={() => setState({ ...state, invDropOpen: !state.invDropOpen })}
      >
        <span>{t("invitemem")}</span>
      </li>
      {state.invDropOpen && (
        <MembersDropdown
          targetID={chatID}
          targetType={"chat"}
          listType={"friends"}
          close={closeInvDropdown}
          ErrorHandler={ErrorHandler}
          ReactGA={ReactGA}
          t={t}
        />
      )}
      <li className="leave" onClick={leaveDialog}>
        <span>{t("leaveconv")}</span>
      </li>{" "}
      <li className="report" onClick={setBlockModalVisible}>
        <span>{t("reportconv")}</span>
      </li>
    </ul>
  );
});

export default ChatActions;
