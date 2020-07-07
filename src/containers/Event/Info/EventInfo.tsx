import React from "react";
import ReactGA from 'react-ga';
import { WithT } from "i18next";

import * as ErrorHandler from "components/common/ErrorHandler";
import NoEventImg from "assets/img/elements/no-eve-image.jpg";
import { kinkOptions } from "../../../docs/options";

import AttendEvent from "./AttendEvent";
import EditEventBtn from "./EditEventBtn";

interface IEventInfoProps extends WithT {
  event: any;
  isOwner: boolean;
  openDelete: any;
  refetch: any;
  dayjs: any;
  distanceMetric: string;
  lang: string;
  toggleScroll: any;
  session: any;
  handlePreview: any;
}

const EventInfo: React.FC<IEventInfoProps> = ({
  event,
  isOwner,
  openDelete,
  refetch,
  dayjs,
  distanceMetric,
  lang,
  toggleScroll,
  session,
  handlePreview,
  t,
}) => {
  const {
    id,
    startTime,
    endTime,
    type,
    kinks,
    distance,
    address,
    participants,
    image
  } = event;

  return (
    <ErrorHandler.ErrorBoundary>
      <div className="event-info-content hid-mobile">
        <div className="event-image">
          <span>
            <img src={image || NoEventImg} alt="" onClick={handlePreview} />
          </span>
        </div>
        <ul>
          <li>
            <span className="head">{t("evestart")}:</span>
            <span className="title">
              {dayjs(startTime)
                .locale(lang)
                .format("DD MMMM YYYY @ HH:mm")
                .toString()}
            </span>
          </li>
          <li>
            <span className="head">{t("eveend")}:</span>
            <span className="title">
              {dayjs(endTime)
                .locale(lang)
                .format("DD MMMM YYYY @ HH:mm")
                .toString()}
            </span>
          </li>
          <li>
            <span className="head">{t("Type")}:</span>
            <span className="title">{type}</span>
          </li>
          <li>
            <span className="head">{t("toexpect")}:</span>
            <span className="title">
              {kinks.reduce(function (result, kink, idx) {
                const kinkObj = kinkOptions.find((el) => el.value === kink);
                if (idx !== kinks.length - 1) {
                  result.push(t(kinkObj.label) + ", ");
                } else {
                  result.push(t(kinkObj.label));
                }
                return result;
              }, [])}
            </span>
          </li>
          <li>
            <span className="head">{t("Away")}:</span>
            <span className="title">
              {distance}{" "}
              {t(
                "common:" + (distanceMetric === "mi" ? "miles" : "kilometers")
              )}
            </span>
          </li>
          <li>
            <span className="head">{t("common:Address")}:</span>
            <span className="title address">{address}</span>
          </li>
        </ul>
        {!isOwner ? (
          <AttendEvent
            id={id}
            isGoing={participants.some(
              (participant) => participant.id === session.currentuser.profileID
            )}
            t={t}
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
            session={session}
          />
        ) : (
            <>
              <EditEventBtn
                id={id}
                t={t}
                ErrorHandler={ErrorHandler}
                updateEventProps={event}
                refetch={refetch}
                lang={lang}
                ReactGA={ReactGA}
                toggleScroll={toggleScroll}
                dayjs={dayjs}
              />
              <div className="join-event">
                <span onClick={openDelete}>{t("canevent")}</span>
              </div>
            </>
          )}
      </div>
    </ErrorHandler.ErrorBoundary>
  );
};

export default EventInfo;
