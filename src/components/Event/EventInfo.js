import React, { Component } from "react";
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
      eventProps.type !== nextEventProps.type
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
      dayjs
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
      <div className="event-info-content hid-mobile">
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
                .locale(localStorage.getItem("i18nextLng"))
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
                .locale(localStorage.getItem("i18nextLng"))
                .format("HH:mm")
                .toString()}{" "}
              -{" "}
              {dayjs(endTime)
                .locale(localStorage.getItem("i18nextLng"))
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
            <span className="title">{desires.map(desire => desire + ",")}</span>
          </li>
          <li>
            <span className="head">{t("Away")}:</span>
            <span className="title">{distance} Miles</span>
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
          />
        ) : (
          <>
            <EditEventBtn
              id={id}
              t={t}
              ErrorHandler={ErrorHandler}
              updateEventProps={event}
              refetch={refetch}
            />
            <div className="join-event">
              <span onClick={() => openDelete()}>Cancel Event</span>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default EventInfo;
