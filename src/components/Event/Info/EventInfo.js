import React, { Component } from "react";
import { kinkOptions } from "../../../docs/options";
import AttendEvent from "./AttendEvent";
import EditEventBtn from "./EditEventBtn";
import NoEventImg from "../../../assets/img/elements/no-eve-image.jpg";

class EventInfo extends Component {
  shouldComponentUpdate(nextProps) {
    const { event: eventProps } = this.props;
    const { event: nextEventProps } = nextProps;

    if (
      eventProps.address !== nextEventProps.address ||
      !eventProps.kinks.every(e => nextEventProps.kinks.includes(e)) ||
      eventProps.distance !== nextEventProps.distance ||
      eventProps.endTime !== nextEventProps.endTime ||
      eventProps.startTime !== nextEventProps.startTime ||
      eventProps.type !== nextEventProps.type ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      event,
      t,
      ErrorHandler,
      isOwner,
      openDelete,
      refetch,
      dayjs,
      distanceMetric,
      lang,
      ReactGA,
      toggleScroll,
      session
    } = this.props;

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
              <img src={image || NoEventImg} alt="" />
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
                {kinks.reduce(function(result, kink, idx) {
                  const kinkObj = kinkOptions.find(el => el.value === kink);
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
                `${distance} $
                {t(
                  "common:" + (distanceMetric === "mi" ? "miles" : "kilometers")
                )}
                `
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
              participants={participants}
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
                <span onClick={() => openDelete()}>{t("canevent")}</span>
              </div>
            </>
          )}
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default EventInfo;
