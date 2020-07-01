import React, { useState } from "react";

import MembersDropdown from "../../../components/common/MembersDropdown";

interface IEventShare {
  id: string;
  t: any;
  showShareModal: any;
  ErrorHandler: any;
  ReactGA: any;
}

const EventShare: React.FC<IEventShare> = ({
  id,
  t,
  showShareModal,
  ErrorHandler,
  ReactGA
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
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
          />
        )}
      </div>
    </>
  );
};

export default EventShare;
