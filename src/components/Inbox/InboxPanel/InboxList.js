import React, { PureComponent } from "react";
import { Waypoint } from "react-waypoint";
import { NEW_INBOX_SUB, GET_INBOX } from "../../../queries";
import TimeAgo from "../../../utils/TimeAgo";
import { preventContextMenu } from "../../../utils/image";
const NoProfileImg = require("../../../assets/img/elements/no-profile.png");

class InboxList extends PureComponent {
  unsubscribe;
  state = { chatID: null, messages: this.props.messages };
  componentDidMount() {
    this.mounted = true;
    this.subscribeInboxMsgs();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages !== nextProps) {
      this.setState({ messages: nextProps.messages });
    }
  }

  handleEnd = previousPosition => {
    const { skip } = this.state;
    const { limit } = this.props;

    if (previousPosition === Waypoint.below) {
      if (this.mounted) {
        this.setState({ skip: skip + limit, loading: true }, () =>
          this.fetchData()
        );
      }
    }
  };

  fetchData = () => {
    if (this.mounted) {
      this.setState({ loading: true }, () =>
        this.props.fetchMore({
          variables: {
            skip: this.state.skip,
            limit: this.props.limit
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (this.mounted) {
              this.setState({ loading: false });
            }

            if (
              !fetchMoreResult ||
              !fetchMoreResult.getInbox ||
              !fetchMoreResult.getInbox.length === 0
            ) {
              return previousResult;
            }
            previousResult.getInbox = [
              previousResult,
              ...fetchMoreResult.getInbox
            ];

            this.setState({ messages: previousResult });
            return previousResult;
          }
        })
      );
    }
  };

  renderItem = (item, timeAgo) => {
    const { currentuser, readChat, t } = this.props;

    let title;
    if (item.type === "alert" || item.type === "left") {
      title = "Foxtail";
      item.profilePic = NoProfileImg;
    } else {
      if (item.fromUser) {
        if (
          item.fromUser.id === currentuser.userID &&
          item.participants.length > 0
        ) {
          title = item.participants[0].profileName;
        } else {
          title = item.fromUser.username;
        }
        let notME = item.participants.filter(
          el => el.id.toString() !== currentuser.profileID
        );
        if (item.fromUser.id === currentuser.userID && notME.length > 0) {
          item.profilePic = notME[0].profilePic;
        }
      } else {
        title = item.fromProfile.profileName;
      }

      //kinda hacky but need to use "New Match!" for inbox subscription
      item.text =
        item.text === "" || item.text === "New Match!"
          ? t("newmatch")
          : item.text;
    }

    return (
      <div className="item unread" key={item.chatID}>
        <span
          onClick={() => readChat(item.chatID, item.unSeenCount)}
          className="inbox-item"
        >
          <span className="img">
            <img
              src={item.profilePic !== "" ? item.profilePic : NoProfileImg}
              alt=""
              onContextMenu={preventContextMenu}
            />
          </span>
          <div className="data">
            <span className="name">{title}</span>
            <span className="time">{timeAgo}</span>
            <span className="msg">
              {item.type === "left"
                ? item.text + " " + t("leftchat")
                : item.text}
            </span>
            {item.unSeenCount !== 0 && (
              <span className="notif">{item.unSeenCount}</span>
            )}
          </div>
        </span>
      </div>
    );
  };

  renderMsgList = ({ messages }) => {
    if (messages.length === 0) {
      return <span className="no-message">{this.props.t("nomsgsInbox")}</span>;
    }

    return (
      <>
        {messages.map((message, i) => {
          var timeAgo = TimeAgo(message.createdAt);

          return this.renderItem(message, timeAgo);
        })}
      </>
    );
  };

  subscribeInboxMsgs = () => {
    if (this.mounted) {
      this.unsubscribe = this.props.subscribeToMore({
        document: NEW_INBOX_SUB,
        updateQuery: (prev, { subscriptionData }) => {
          if (this.mounted) {
            const { newInboxMsgSubscribe } = subscriptionData.data;
            if (!newInboxMsgSubscribe) {
              return prev;
            }

            let previousResult = Array.from(prev.getInbox);

            if (previousResult) {
              const chatIndex = previousResult.findIndex(
                el => el.chatID === newInboxMsgSubscribe.chatID
              );

              if (chatIndex > -1) {
                previousResult[chatIndex] = newInboxMsgSubscribe;
              } else {
                previousResult = [newInboxMsgSubscribe, ...previousResult];
              }

              if (
                sessionStorage.getItem("page") === "inbox" &&
                sessionStorage.getItem("pid") === newInboxMsgSubscribe.chatID
              ) {
                previousResult[chatIndex].unSeenCount = 0;
              }
            }

            //update the cache - causes issue when getting subs
            const { cache } = this.props.client;
            const { getInbox } = cache.readQuery({
              query: GET_INBOX,
              variables: {
                limit: parseInt(process.env.REACT_APP_INBOXLIST_LIMIT),
                skip: 0
              }
            });
            let newData = Array.from(getInbox);

            const chatIndex = newData.findIndex(
              chat => chat.chatID === newInboxMsgSubscribe.chatID
            );

            if (chatIndex > -1) {
              newData[chatIndex] = newInboxMsgSubscribe;
              cache.writeQuery({
                query: GET_INBOX,
                variables: {
                  limit: parseInt(process.env.REACT_APP_INBOXLIST_LIMIT),
                  skip: 0
                },
                data: {
                  getInbox: [...newData]
                }
              });
            }

            this.setState({
              messages: [...previousResult]
            });
            return [...previousResult];
          }
        }
      });
    }
  };

  //Variables by text
  render() {
    const { searchTerm } = this.props;

    let { messages } = this.state;

    if (searchTerm !== "") {
      messages = messages.filter(msg =>
        msg.participants[0].profileName
          .toLocaleLowerCase()
          .startsWith(searchTerm.toLocaleLowerCase())
      );
    }

    return (
      <div className="conversations">
        {this.renderMsgList({ messages })}
        <div className="item">
          <Waypoint
            onEnter={({ previousPosition }) => this.handleEnd(previousPosition)}
          />
        </div>
      </div>
    );
  }
}

export default InboxList;
