import React, { useState } from "react";
import ReactGA from 'react-ga';
import { WithT } from "i18next";

import * as ErrorHandler from "components/common/ErrorHandler";
import CreateEvent from "components/Modals/CreateEvent";

interface IEditEventBtnProps extends WithT {
  id: string;
  updateEventProps: any;
  refetch: any;
  lang: string;
  dayjs: any;
  toggleScroll: any;
}

const EditEventBtn: React.FC<IEditEventBtnProps> = ({
  id,
  updateEventProps,
  refetch,
  lang,
  t,
  dayjs,
  toggleScroll
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (toggleScroll) {
      toggleScroll(!showPopup);
    }
  };

  ErrorHandler.setBreadcrumb("Open Edit Event");
  return (
    <>
      <div className="join-event">
        <span onClick={togglePopup}>{t("common:updateevent")}</span>
      </div>
      {showPopup ? (
        <CreateEvent
          close={togglePopup}
          ErrorHandler={ErrorHandler}
          eventID={id}
          updateEventProps={updateEventProps}
          refetch={refetch}
          lang={lang}
          ReactGA={ReactGA}
          dayjs={dayjs}
        />
      ) : null}
    </>
  );
};

export default EditEventBtn;
