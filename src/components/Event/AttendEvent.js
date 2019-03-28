import React, { PureComponent } from "react";
import withSession from "../withSession";
import { Mutation } from "react-apollo";
import {
  TOGGLE_EVENT_ATTEND,
  GET_EVENT,
  GET_EVENT_PARTICIPANTS
} from "../../queries";

class AttendEvent extends PureComponent {
  state = {
    username: "",
    isGoing: false
  };

  componentDidMount() {
    if (this.props.session.currentuser) {
      const { username, profileID } = this.props.session.currentuser;
      const prevGoing = this.props.participants.some(
        participant => participant.id === profileID
      );

      this.setState({
        isGoing: prevGoing,
        username
      });
    }
  }

  handleAttend = toggleAttend => {
    this.props.ErrorHandler.setBreadcrumb("Toggle Attend");
    toggleAttend()
      .then(async ({ data }) => {
        if (data.toggleAttendEvent !== null) {
          await this.props.refetch();
        }
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  handleClick = toggleAttend => {
    this.setState(
      prevState => ({
        isGoing: !prevState.isGoing
      }),
      () => this.handleAttend(toggleAttend)
    );
  };

  updateAttend = (cache, { data: { toggleAttendEvent } }) => {
    if (toggleAttendEvent !== null) {
      const { id } = this.props;

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

      const getEvent = cache.readQuery({
        query: GET_EVENT_PARTICIPANTS,
        variables: { eventID: id }
      });

      if (this.state.isGoing) {
        getEvent.event.participants = [
          {
            id: toggleAttendEvent,
            profileName: this.props.session.currentuser.username,
            profilePic: this.props.session.currentuser.profilePic,
            __typename: "ProfileType"
          },
          ...getEvent.event.participants
        ];
      } else {
        getEvent.event.participants = getEvent.event.participants.filter(
          member => member.id !== toggleAttendEvent
        );
      }

      cache.writeQuery({
        query: GET_EVENT_PARTICIPANTS,
        variables: { eventID: id },
        data: { getEvent }
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

export default withSession(AttendEvent);
