import React, { Component } from "react";
import withSession from "../withSession";
import { Mutation } from "react-apollo";
import { TOGGLE_EVENT_ATTEND, GET_EVENT } from "../../queries";

class AttendEvent extends Component {
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
    toggleAttend()
      .then(async ({ data }) => {
        if (data.toggleAttendEvent !== null) {
          await this.props.refetch();
        }
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
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
                    profileName: "x",
                    profilePic: "x",
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
    const { id } = this.props;
    return (
      <Mutation
        mutation={TOGGLE_EVENT_ATTEND}
        variables={{ eventID: id }}
        update={this.updateAttend}
      >
        {(toggleAttendEvent, { loading }) => {
          return (
            username && (
              <button onClick={() => this.handleClick(toggleAttendEvent)}>
                {isGoing ? "Not Going" : "Going"}
              </button>
            )
          );
        }}
      </Mutation>
    );
  }
}

export default withSession(AttendEvent);
