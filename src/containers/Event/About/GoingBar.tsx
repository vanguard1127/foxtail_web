import React, { useState } from "react";
import ReactGA from 'react-ga';
import { WithT } from "i18next";

import MembersDropdown from "../../../components/common/MembersDropdown";

interface IGoingBarProps extends WithT {
  id: string;
  participants: any;
  isOwner: boolean;
}

const GoingBar: React.FC<IGoingBarProps> = ({
  id,
  participants,
  t,
  isOwner,
}) => {
  const [remDropOpen, setRemDropOpen] = useState(false);

  const closeRemDropdown = () => setRemDropOpen(false);

  const toggleDropOpen = () => {
    ReactGA.event({
      category: "Event",
      action: !remDropOpen ? "Close Invite" : "Open Invite"
    });
    setRemDropOpen(!remDropOpen);
  };

  return (
    <div className="goings">
      <span className="stats">
        <div className="content" onClick={toggleDropOpen}>
          <ul>
            {participants.map((el) => (
              <li key={el.id}>
                <img src={el.profilePic} alt="" />
              </li>
            ))}
          </ul>
          <span className="stats">
            <b>
              {participants.length} {t("common:people")}
            </b>{" "}
            {t("common:going")}
          </span>
        </div>
        {remDropOpen && (
          <MembersDropdown
            targetID={id}
            targetType={"event"}
            listType={"participants"}
            isOwner={isOwner}
            t={t}
            close={closeRemDropdown}
          />
        )}
      </span>
    </div>
  );
};

export default GoingBar;
