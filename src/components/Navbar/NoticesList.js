import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATIONS,
  NEW_NOTICE_SUB,
  GET_COUNTS
} from '../../queries';
import { Query, Mutation, withApollo } from 'react-apollo';
import Waypoint from 'react-waypoint';
import { preventContextMenu } from '../../utils/image';
import moment from 'moment';

const LIMIT = 5;
const intialState = {
  read: null,
  seen: null,
  notificationIDs: [],
  count: 0,
  skip: 0,
  visible: false
};

class NoticesList extends Component {
  state = {
    ...intialState
  };

  componentDidMount() {
    this.props.subscribeToNewNotices();
  }
  clearState = () => {
    this.setState({ ...intialState });
  };

  handleEnd = ({ previousPosition, fetchMore }) => {
    console.log('OOPO', previousPosition);
    //if totoal reach skip and show no more sign
    const { skip } = this.state;
    if (previousPosition === Waypoint.below) {
      this.setState(
        state => ({ skip: skip + LIMIT }),
        () => this.fetchData(fetchMore)
      );
    }
  };

  fetchData = fetchMore => {
    this.setState({ loading: true });

    fetchMore({
      variables: {
        skip: this.state.skip,
        limit: LIMIT
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        console.log(previousResult, fetchMoreResult);
        if (
          !fetchMoreResult ||
          !fetchMoreResult.getNotifications ||
          fetchMoreResult.getNotifications.notifications.length === 0
        ) {
          return previousResult;
        }
        previousResult.getNotifications.notifications = [
          ...fetchMoreResult.getNotifications.notifications,
          ...previousResult.getNotifications.notifications
        ];

        return previousResult;
      }
    });
  };

  readNotices = (notificationIDs, updateNotifications) => {
    this.setState({ notificationIDs, read: true }, () => {
      updateNotifications()
        .then(({ data }) => {
          this.clearState();
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });
          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    });
  };

  readAndGo = ({ notifications, targetID, type, updateNotifications }) => {
    try {
      const { close } = this.props;
      if (notifications.length !== 0) {
        this.readNotices(notifications, updateNotifications);

        switch (type) {
          case 'chat':
            this.props.history.push('/inbox/' + targetID);
            break;
          case 'event':
            this.props.history.push('/event/' + targetID);
            break;
          default:
            break;
        }
        close();
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  handleNotice = ({ notif, updateNotifications, t }) => {
    if (notif.type === 'alert') {
      return (
        <span onClick={() => this.props.showAlert(notif)}>
          <span className="avatar">
            <img
              src={'../../../images/girl2.jpg'}
              alt=""
              onContextMenu={preventContextMenu}
            />
          </span>
          <div>
            <span className="text">{t(notif.text)}</span>
            <span className="when">
              {moment(notif.date)
                .locale(localStorage.getItem('i18nextLng'))
                .fromNow()}
            </span>
          </div>
        </span>
      );
    } else {
      return (
        <span
          onClick={() =>
            this.readAndGo({
              notifications: [notif.id],
              targetID: notif.targetID,
              type: notif.type,
              updateNotifications
            })
          }
        >
          <span className="avatar">
            <img
              src={notif.fromProfile.profilePic}
              alt=""
              onContextMenu={preventContextMenu}
            />
          </span>
          <div>
            <span className="text">
              <b> {notif.fromProfile.profileName} </b>
              {t(notif.text)}
            </span>
            <span className="when">
              {moment(notif.date)
                .locale(localStorage.getItem('i18nextLng'))
                .fromNow()}
            </span>
          </div>
        </span>
      );
    }
  };

  render() {
    const { t, notifications, updateNotifications, fetchMore } = this.props;

    return (
      <div className="toggle">
        <div className="notification open">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div className="item" key={notif.id}>
                {this.handleNotice({ notif, updateNotifications, t })}
              </div>
            ))
          ) : (
            <div className="item" key="na">
              <span className="text">No notifcations</span>
            </div>
          )}
          {/* TODO: Use this if fails to waypoint */}
          {/* <div className="item" key="way">
            <Waypoint
              onEnter={({ previousPosition }) => {
                this.handleEnd({ previousPosition, fetchMore });
              }}
              style={{ padding: '5px', backgroundColor: 'blue' }}
            />
            <span className="text">No more notifications :)</span>
          </div> */}
          <div
            key="way"
            style={{ width: '100%', display: 'block', float: 'left' }}
          >
            <Waypoint
              onEnter={({ previousPosition }) => {
                this.handleEnd({ previousPosition, fetchMore });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(withRouter(NoticesList));
