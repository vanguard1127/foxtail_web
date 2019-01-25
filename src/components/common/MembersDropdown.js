import React, { Component } from "react";
import Dropdown from "rc-dropdown";
import {
  GET_FRIENDS,
  GET_CHAT_PARTICIPANTS,
  GET_EVENT_PARTICIPANTS
} from "../../queries";
import { Query } from "react-apollo";
import Spinner from "./Spinner";
import MembersList from "./MembersList";
import Menu from "../common/Menu";
const LIMIT = 5;
class MembersDropdown extends Component {
  state = { visible: false };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };
  render() {
    const { targetType, targetID, listType, clickComponent, t } = this.props;
    if (listType === "friends") {
      return (
        <Query query={GET_FRIENDS} variables={{ limit: LIMIT }}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return (
                <Spinner message={t("common:Loading") + "..."} size="large" />
              );
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.getFriends) {
              return <div>{t("common:error") + "!"}</div>;
            } else if (!data.getFriends.length === 0) {
              return <div>{t("common:nomoremsgs") + " :)"}</div>;
            }

            const members = data.getFriends;
            return (
              <Menu menuOpener={clickComponent}>
                <div className="invite-member open">
                  <div className="content">
                    <div className="head">Invite Members</div>
                    <div className="inv-item">
                      <div className="select-checkbox">
                        <input type="checkbox" id="cbox" checked="" />
                        <label for="cbox">
                          <span />
                        </label>
                      </div>
                      <div className="avatar">
                        <a href="#">
                          <img src="assets/img/usr/avatar/1001@2x.png" alt="" />
                        </a>
                      </div>
                      <span className="username">Chris</span>
                    </div>
                    <div className="inv-item">
                      <div className="select-checkbox">
                        <input type="checkbox" id="cbox" checked="" />
                        <label for="cbox">
                          <span />
                        </label>
                      </div>
                      <div className="avatar">
                        <a href="#">
                          <img src="assets/img/usr/avatar/1004@2x.png" alt="" />
                        </a>
                      </div>
                      <span className="username">Meggie</span>
                    </div>
                    <div className="apply-content">
                      <span>Invite</span>
                    </div>
                  </div>
                </div>
              </Menu>
            );
          }}
        </Query>
      );
    } else if (listType === "participants" && targetType === "chat") {
      return (
        <Query query={GET_CHAT_PARTICIPANTS} variables={{ chatID: targetID }}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return (
                <Spinner message={t("common:Loading") + "..."} size="large" />
              );
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.chat) {
              return <div>{t("common:error") + "!"}</div>;
            } else if (!data.chat.participants.length === 0) {
              return <div>{t("common:nomoremsgs") + " :)"}</div>;
            }
            const members = data.chat.participants;
            return (
              <Dropdown
                overlay={
                  <MembersList
                    members={members}
                    fetchMore={fetchMore}
                    targetID={targetID}
                    listType={listType}
                    targetType={targetType}
                    close={() => this.handleVisibleChange(false)}
                    t={t}
                  />
                }
                trigger={["click"]}
                placement="bottomRight"
                onVisibleChange={this.handleVisibleChange}
                visible={this.state.visible}
              >
                <span>{clickComponent}</span>
              </Dropdown>
            );
          }}
        </Query>
      );
    } else if (listType === "participants" && targetType === "event") {
      return (
        <Query query={GET_EVENT_PARTICIPANTS} variables={{ eventID: targetID }}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.event) {
              return <div>{t("common:error") + "!"}</div>;
            } else if (!data.event.participants.length === 0) {
              return <div>{t("common:nomorepart")}</div>;
            }
            const members = data.event.participants;
            return (
              <Dropdown
                overlay={
                  <MembersList
                    members={members}
                    fetchMore={fetchMore}
                    targetID={targetID}
                    listType={listType}
                    targetType={targetType}
                    close={() => this.handleVisibleChange(false)}
                    t={t}
                  />
                }
                trigger={["click"]}
                placement="bottomRight"
                onVisibleChange={this.handleVisibleChange}
                visible={this.state.visible}
              >
                <span>{clickComponent}</span>
              </Dropdown>
            );
          }}
        </Query>
      );
    }
  }
}

export default MembersDropdown;
