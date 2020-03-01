import React, { PureComponent } from "react";
import {
  GET_FRIENDS,
  GET_CHAT_PARTICIPANTS,
  GET_EVENT_PARTICIPANTS
} from "../../../queries";
import { Query } from "react-apollo";
import MembersList from "./MembersList";
import "./membersDropdown.css";

class MembersDropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  state = { visible: false };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener("touchstart", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.removeEventListener("touchstart", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.props.close();
    }
  };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };
  render() {
    const {
      targetType,
      targetID,
      listType,
      t,
      close,
      isOwner,
      style,
      ErrorHandler,
      ReactGA
    } = this.props;
    if (listType === "friends") {
      return (
        <Query
          query={GET_FRIENDS}
          variables={{
            limit: parseInt(process.env.REACT_APP_MEMSLIST_LIMIT),
            chatID: targetID,
            isEvent: targetType === "event",
            isMobile: sessionStorage.getItem("isMobile")
          }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return null;
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.getFriends) {
              return <div>{t("common:error") + "!"}</div>;
            } else if (!data.getFriends.length === 0) {
              return <div>{t("common:nomoremsgs") + " :)"}</div>;
            }

            const members = data.getFriends;

            return (
              <div
                className={
                  targetType === "event"
                    ? "members-toggle invite-event"
                    : "members-toggle invite"
                }
                ref={this.wrapperRef}
                style={{ ...style }}
              >
                <div className="invite-member">
                  <div className="content">
                    <div className="head">{t("common:invitemems")}</div>
                    {members.length === 0 && <div>{t("common:nomem")}</div>}
                    {members.length !== 0 && (
                      <MembersList
                        members={members}
                        fetchMore={fetchMore}
                        targetID={targetID}
                        listType={listType}
                        targetType={targetType}
                        close={close}
                        showActionButton={true}
                        t={t}
                        ErrorHandler={ErrorHandler}
                        ReactGA={ReactGA}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    } else if (
      listType === "participants" &&
      targetType === "chat" &&
      isOwner
    ) {
      return (
        <Query
          query={GET_CHAT_PARTICIPANTS}
          variables={{
            chatID: targetID,
            isMobile: sessionStorage.getItem("isMobile")
          }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return null;
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.chat) {
              return <div>{t("common:error") + "!"}</div>;
            } else if (!data.chat.participants.length === 0) {
              return <div>{t("common:nomoremsgs") + " :)"}</div>;
            }
            const members = data.chat.participants;
            return (
              <div
                className="members-toggle participants"
                ref={this.wrapperRef}
                style={{ ...style }}
              >
                <div className="invite-member">
                  <div className="content">
                    <div className="head">{t("common:removemems")}</div>
                    {members.length === 0 && <div>{t("common:nomem")}</div>}
                    <MembersList
                      members={members}
                      fetchMore={fetchMore}
                      targetID={targetID}
                      listType={listType}
                      targetType={targetType}
                      showActionButton={true}
                      close={close}
                      t={t}
                      ErrorHandler={ErrorHandler}
                      ReactGA={ReactGA}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    } else if (
      listType === "participants" &&
      targetType === "chat" &&
      !isOwner
    ) {
      return (
        <Query
          query={GET_CHAT_PARTICIPANTS}
          variables={{
            chatID: targetID,
            isMobile: sessionStorage.getItem("isMobile")
          }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return null;
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.chat) {
              return <div>{t("common:error") + "!"}</div>;
            } else if (!data.chat.participants.length === 0) {
              return <div>{t("common:nomoremsgs") + " :)"}</div>;
            }
            const members = data.chat.participants;

            return (
              <div
                className="members-toggle participants"
                ref={this.wrapperRef}
                style={{ ...style }}
              >
                <div className="invite-member">
                  <div className="content">
                    <div className="head">{t("common:Participants")}</div>
                    {members.length === 0 && <div>{t("common:nomem")}</div>}
                    <MembersList
                      members={members}
                      fetchMore={fetchMore}
                      targetID={targetID}
                      listType={listType}
                      targetType={targetType}
                      showActionButton={false}
                      close={close}
                      t={t}
                      ErrorHandler={ErrorHandler}
                      ReactGA={ReactGA}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    } else if (
      listType === "participants" &&
      targetType === "event" &&
      isOwner
    ) {
      return (
        <Query
          query={GET_EVENT_PARTICIPANTS}
          variables={{
            eventID: targetID,
            isMobile: sessionStorage.getItem("isMobile")
          }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return null;
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.event) {
              return <div>{t("common:error") + "!"}</div>;
            } else if (!data.event.participants.length === 0) {
              return <div>{t("common:nomorepart")}</div>;
            }
            const members = data.event.participants;

            return (
              <div
                className="members-toggle"
                ref={this.wrapperRef}
                style={{ ...style }}
              >
                <div className="invite-member">
                  <div className="content">
                    <div className="head">{t("common:removemems")}</div>
                    {members.length === 0 && <div>{t("common:nomem")}</div>}
                    <MembersList
                      members={members}
                      fetchMore={fetchMore}
                      targetID={targetID}
                      listType={listType}
                      targetType={targetType}
                      close={close}
                      showActionButton={true}
                      t={t}
                      ErrorHandler={ErrorHandler}
                      ReactGA={ReactGA}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    } else if (
      listType === "participants" &&
      targetType === "event" &&
      !isOwner
    ) {
      return (
        <Query
          query={GET_EVENT_PARTICIPANTS}
          variables={{
            eventID: targetID,
            isMobile: sessionStorage.getItem("isMobile")
          }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return null;
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.event) {
              return <div>{t("common:error") + "!"}</div>;
            } else if (!data.event.participants.length === 0) {
              return <div>{t("common:nomorepart")}</div>;
            }
            const members = data.event.participants;

            return (
              <div
                className="members-toggle"
                ref={this.wrapperRef}
                style={{ ...style }}
              >
                <div className="invite-member">
                  <div className="content">
                    <div className="head">{t("common:Participants")}</div>
                    {members.length === 0 && <div>{t("common:nomem")}</div>}
                    <MembersList
                      members={members}
                      fetchMore={fetchMore}
                      targetID={targetID}
                      listType={listType}
                      targetType={targetType}
                      close={close}
                      showActionButton={false}
                      t={t}
                      ErrorHandler={ErrorHandler}
                      ReactGA={ReactGA}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    }
  }
}

export default MembersDropdown;
