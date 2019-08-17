import React, { Component } from "react";
import { formatedMilesToKm } from "../../../utils/distanceMetric";
import { desireOptions } from "../../../docs/options";
import AttendEvent from "./AttendEvent";
import EditEventBtn from "./EditEventBtn";
class EventInfo extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { event: eventProps } = this.props;
    const { event: nextEventProps } = nextProps;

    if (
      eventProps.address !== nextEventProps.address ||
      !eventProps.desires.every(e => nextEventProps.desires.includes(e)) ||
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
      desires,
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
              <img src={image || "/assets/img/events/no-image.png"} alt="" />
            </span>
          </div>
          <ul>
            <li>
              <span className="head">{t("evedate")}:</span>
              <span className="title">
                {dayjs(startTime)
                  .locale(lang)
                  .format("DD MMMM YYYY, dddd")
                  .toString()}
              </span>
            </li>
            <li>
              <span className="head">
                {t("evedate")} - {t("time")}:
              </span>
              <span className="title">
                {dayjs(startTime)
                  .locale(lang)
                  .format("HH:mm")
                  .toString()}{" "}
                -{" "}
                {dayjs(endTime)
                  .locale(lang)
                  .format("HH:mm")
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
                {desires.reduce(function(result, desire, idx) {
                  const desireObj = desireOptions.find(
                    el => el.value === desire
                  );
                  if (idx !== desires.length - 1) {
                    result.push(t(desireObj.label) + ", ");
                  } else {
                    result.push(t(desireObj.label));
                  }
                  return result;
                }, [])}
              </span>
            </li>
            <li>
              <span className="head">{t("Away")}:</span>
              <span className="title">
                {formatedMilesToKm(distance, distanceMetric, t)}
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
