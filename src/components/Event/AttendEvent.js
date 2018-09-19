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
      const prevGoing = this.props.participants.indexOf(profileID) > -1;
      this.setState({
        isGoing: prevGoing,
        username
      });
    }
  }

  handleAttend = toggleAttend => {
    toggleAttend().then(async ({ data }) => {
      await this.props.refetch();
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
    const { id } = this.props;
    const { event } = cache.readQuery({ query: GET_EVENT, variables: { id } });
    cache.writeQuery({
      query: GET_EVENT,
      variables: { id },
      data: {
        event: {
          ...event,
          participants: this.state.isGoing
            ? [toggleAttendEvent, ...event.participants]
            : event.participants.filter(member => member !== toggleAttendEvent)
        }
      }
    });
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
        {toggleAttendEvent =>
          username && (
            <button onClick={() => this.handleClick(toggleAttendEvent)}>
              {isGoing ? "Not Going" : "Going"}
            </button>
          )
        }
      </Mutation>
    );
  }
}

export default withSession(AttendEvent);
