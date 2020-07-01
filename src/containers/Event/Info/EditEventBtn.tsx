import React, { useState } from "react";

import CreateEvent from "../../../components/Modals/CreateEvent";

interface IEditEventBtnProps {
  id: string;
  updateEventProps: any;
  refetch: any;
  lang: string;
  t: any;
  ReactGA: any;
  dayjs: any;
  ErrorHandler: any;
  toggleScroll: any;
}

const EditEventBtn: React.FC<IEditEventBtnProps> = ({
  id,
  updateEventProps,
  refetch,
  lang,
  t,
  ReactGA,
  dayjs,
  ErrorHandler,
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
