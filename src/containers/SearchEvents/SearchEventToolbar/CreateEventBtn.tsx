import React, { useState } from "react";
import { WithT } from "i18next";

import CreateEvent from "components/Modals/CreateEvent/";

interface ICreateEventBtn extends WithT {
  ErrorHandler: any;
  dayjs: any;
  lang: string;
  ReactGA: any;
  history: any;
  toggleScroll: any;
}

const CreateEventBtn: React.FC<ICreateEventBtn> = ({
  lang,
  t,
  ErrorHandler,
  history,
  ReactGA,
  dayjs,
  toggleScroll
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    toggleScroll();
  };

  ErrorHandler.setBreadcrumb("Open Create Event");
  return (
    <>
      <div className="create-event-btn" onClick={togglePopup}>
        <span>{t("common:createevent")}</span>
      </div>
      {showPopup && (
        <CreateEvent
          close={togglePopup}
          ErrorHandler={ErrorHandler}
          lang={lang}
          history={history}
          ReactGA={ReactGA}
          dayjs={dayjs}
        />
      )}
    </>
  );
};

export default CreateEventBtn;
