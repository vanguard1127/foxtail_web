import React, { Component } from 'react';
import withSession from '../withSession';
import { Mutation } from 'react-apollo';
import { TOGGLE_EVENT_ATTEND, GET_EVENT } from '../../queries';

class AttendEvent extends Component {
  state = {
    username: '',
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
    this.props.ErrorHandler.setBreadcrumb('Toggle Attend');
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
                    profileName: '',
                    profilePic: '',
                    __typename: 'ProfileType'
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
                  {isGoing ? t('notgoing') : t('Going')}
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
