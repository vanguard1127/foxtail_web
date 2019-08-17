import React, { Component } from "react";
import { formatedMilesToKm } from "../../../utils/distanceMetric";
import { desireOptions } from "../../../docs/options";
import AttendEvent from "./AttendEvent";
import EditEventBtn from "./EditEventBtn";

class EventInfoMobile extends Component {
  shouldComponentUpdate(nextProps) {
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
      dayjs,
      distanceMetric,
      lang,
      refetch,
      ReactGA,
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
      <div className="event-info-content hid-desktop">
        <div className="event-image">
          <span>
            <img src={image || "/assets/img/events/1001@2x.png"} alt="" />
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
              {" "}
              {desires.reduce(function(result, desire, idx) {
                const desireObj = desireOptions.find(el => el.value === desire);
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
              ReactGA={ReactGA}
              lang={lang}
            />
            <div className="join-event">
              <span onClick={() => openDelete()}>{t("canevent")}</span>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default EventInfoMobile;
