import React, { useState, useEffect } from "react";
import ReactGA from 'react-ga';
import { useMutation } from "react-apollo";
import produce from "immer";
import { WithT } from "i18next";

import * as ErrorHandler from "components/common/ErrorHandler";
import {
  TOGGLE_EVENT_ATTEND,
  GET_EVENT,
  GET_EVENT_PARTICIPANTS
} from "queries";

interface IAttendEventProps extends WithT {
  id: string;
  session: any;
  isGoing: boolean;
}

const AttendEvent: React.FC<IAttendEventProps> = ({
  id,
  session,
  isGoing: currIsGoing,
  t,
}) => {
  const [isGoing, setIsGoing] = useState<boolean>(currIsGoing);

  useEffect(() => {
    handleAttend();
  }, [isGoing]);

  const [toggleAttendEvent] = useMutation(TOGGLE_EVENT_ATTEND, {
    variables: { eventID: id },
    update: () => updateAttend
  });

  const handleAttend = () => {
    ErrorHandler.setBreadcrumb("Toggle Attend");
    toggleAttendEvent()
      .then()
      .catch((res) => {
        ErrorHandler.catchErrors(res);
      });
  };

  const handleClick = () => {
    ReactGA.event({
      category: "Event",
      action: !isGoing ? "Unattend" : "Attend"
    });
    setIsGoing(!isGoing);
  };

  const updateAttend = (cache, { data: { toggleAttendEvent } }) => {
    if (toggleAttendEvent !== null) {
      const getEvent = cache.readQuery({
        query: GET_EVENT_PARTICIPANTS,
        variables: { eventID: id }
      });

      let newData;

      if (isGoing) {
        newData = produce(getEvent, (draftState) => {
          draftState.event.participants.push({
            id: toggleAttendEvent,
            profileName: session.currentuser.username,
            profilePic: session.currentuser.profilePic,
            __typename: "ProfileType"
          });
        });
      } else {
        newData = produce(getEvent, (draftState) => {
          draftState.event.participants = draftState.event.participants.filter(
            (member) => member.id !== toggleAttendEvent
          );
        });
      }

      cache.writeQuery({
        query: GET_EVENT_PARTICIPANTS,
        variables: {
          eventID: id,
          isMobile: sessionStorage.getItem("isMobile")
        },
        data: { getEvent: newData }
      });

      const { event } = cache.readQuery({
        query: GET_EVENT,
        variables: { id }
      });

      cache.writeQuery({
        query: GET_EVENT,
        variables: { id },
        data: {
          event: {
            ...event,
            participants: isGoing
              ? [
                {
                  id: toggleAttendEvent,
                  profileName: session.currentuser.username,
                  profilePic: session.currentuser.profilePic,
                  __typename: "ProfileType"
                },
                ...event.participants
              ]
              : event.participants.filter(
                (member) => member.id !== toggleAttendEvent
              )
          }
        }
      });
    }
  };

  return (
    <div className="join-event">
      <span onClick={handleClick}>{isGoing ? t("notgoing") : t("Going")}</span>
    </div>
  );
};

export default AttendEvent;
