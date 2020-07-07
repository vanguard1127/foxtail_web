import React, { useState } from "react";
import { WithT } from "i18next";

import MembersDropdown from "components/common/MembersDropdown";
interface IEventShare extends WithT {
  id: string;
  showShareModal: any;
}

const EventShare: React.FC<IEventShare> = ({
  id,
  showShareModal,
  t,
}) => {
  const [invDropOpen, setInvDropOpen] = useState(false);

  const closeInvDropdown = () => setInvDropOpen(false);
  const toggleDropdown = () => setInvDropOpen(!invDropOpen);

  return (
    <>
      <div className="share-event">
        <span className="title">{t("share")}:</span>
        <ul>
          <li
            className="share"
            title={t(
              "Get a free week of Black Membership when someone using your link joins Foxtail."
            )}
          >
            <span onClick={showShareModal} />
          </li>
          <li className="add">
            <span onClick={toggleDropdown} />
          </li>
        </ul>
        {invDropOpen && (
          <MembersDropdown
            targetID={id}
            targetType={"event"}
            listType={"friends"}
            t={t}
            close={closeInvDropdown}
          />
        )}
      </div>
    </>
  );
};

export default EventShare;
