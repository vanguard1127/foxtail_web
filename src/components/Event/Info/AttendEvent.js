import React, { Component } from "react";
import { Mutation } from "react-apollo";
import produce from "immer";
import {
  TOGGLE_EVENT_ATTEND,
  GET_EVENT,
  GET_EVENT_PARTICIPANTS
} from "../../../queries";

class AttendEvent extends Component {
  state = {
    username: this.props.session.currentuser.username,
    isGoing: this.props.participants.some(
      participant => participant.id === this.props.session.currentuser.profileID
    )
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState || this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  handleAttend = toggleAttend => {
    this.props.ErrorHandler.setBreadcrumb("Toggle Attend");
    toggleAttend()
      .then()
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res);
      });
  };

  handleClick = toggleAttend => {
    if (this.mounted) {
      if (this.state.prevState) {
        this.props.ReactGA.event({
          category: "Event",
          action: !this.state.prevState.isGoing ? "Unattend" : "Attend"
        });
      }
      this.setState(
        prevState => ({
          isGoing: !prevState.isGoing
        }),
        () => this.handleAttend(toggleAttend)
      );
    }
  };

  updateAttend = (cache, { data: { toggleAttendEvent } }) => {
    if (toggleAttendEvent !== null) {
      const { id } = this.props;

      const getEvent = cache.readQuery({
        query: GET_EVENT_PARTICIPANTS,
        variables: { eventID: id, isMobile: sessionStorage.getItem("isMobile") }
      });

      let newData;
      if (this.state.isGoing) {
        newData = produce(getEvent, draftState => {
          draftState.event.participants.push({
            id: toggleAttendEvent,
            profileName: this.props.session.currentuser.username,
            profilePic: this.props.session.currentuser.profilePic,
            __typename: "ProfileType"
          });
        });
      } else {
        newData = produce(getEvent, draftState => {
          draftState.event.participants = draftState.event.participants.filter(
            member => member.id !== toggleAttendEvent
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
            participants: this.state.isGoing
              ? [
                  {
                    id: toggleAttendEvent,
                    profileName: this.props.session.currentuser.username,
                    profilePic: this.props.session.currentuser.profilePic,
                    __typename: "ProfileType"
                  },
                  ...event.participants
                ]
              : event.participants.filter(
                  member => member.id !== toggleAttendEvent
                )
          }
        }
      });
    }
  };

  render() {
    const { username, isGoing } = this.state;
    const { id, t } = this.props;
    return (
      <Mutation
        mutation={TOGGLE_EVENT_ATTEND}
        variables={{ eventID: id }}
        update={this.updateAttend}
      >
        {toggleAttendEvent => {
          return (
            username && (
              <div className="join-event">
                <span onClick={() => this.handleClick(toggleAttendEvent)}>
                  {isGoing ? t("notgoing") : t("Going")}
                </span>
              </div>
            )
          );
        }}
      </Mutation>
    );
  }
}

export default AttendEvent;
