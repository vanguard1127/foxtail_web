import React from "react";
import { Dropdown, Icon, Badge } from "antd";
import {
  GET_FRIENDS,
  GET_CHAT_PARTICIPANTS,
  GET_EVENT_PARTICIPANTS
} from "../../queries";
import { Query } from "react-apollo";
import Spinner from "./Spinner";
import MembersList from "./MembersList";
const LIMIT = 5;
const MembersDropdown = ({ targetType, targetID, listType }) => {
  if (listType === "friends") {
    return (
      <Query query={GET_FRIENDS} variables={{ limit: LIMIT }}>
        {({ data, loading, error, fetchMore }) => {
          if (loading) {
            return <Spinner message="Loading..." size="large" />;
          } else if (error) {
            return <div>{error.message}</div>;
          } else if (!data.getFriends) {
            return <div>Error occured. Please contact support!</div>;
          } else if (!data.getFriends.length === 0) {
            return <div>You are all caught up :)</div>;
          }

          const members = data.getFriends;
          return (
            <Dropdown
              overlay={
                <MembersList
                  members={members}
                  fetchMore={fetchMore}
                  listType={listType}
                  targetID={targetID}
                  targetType={targetType}
                />
              }
              trigger={["click"]}
              placement="bottomRight"
            >
              <a className="ant-dropdown-link" href="#">
                <Badge>
                  {" "}
                  <Icon
                    type={"usergroup-add"}
                    style={{ fontSize: "24px", color: "#934" }}
                  />
                </Badge>
              </a>
            </Dropdown>
          );
        }}
      </Query>
    );
  } else if (listType === "participants" && targetType === "chat") {
    return (
      <Query query={GET_CHAT_PARTICIPANTS} variables={{ chatID: targetID }}>
        {({ data, loading, error, fetchMore }) => {
          if (loading) {
            return <Spinner message="Loading..." size="large" />;
          } else if (error) {
            return <div>{error.message}</div>;
          } else if (!data.chat) {
            return <div>Error occured. Please contact support!</div>;
          } else if (!data.chat.participants.length === 0) {
            return <div>No more participants</div>;
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
                />
              }
              trigger={["click"]}
              placement="bottomRight"
            >
              <a className="ant-dropdown-link" href="#">
                <Badge>
                  {" "}
                  <Icon
                    type={"usergroup-delete"}
                    style={{ fontSize: "24px", color: "#934" }}
                  />
                </Badge>
              </a>
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
            return <div>Error occured. Please contact support!</div>;
          } else if (!data.event.participants.length === 0) {
            return <div>No more participants</div>;
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
                />
              }
              trigger={["click"]}
              placement="bottomRight"
            >
              <a className="ant-dropdown-link" href="#">
                <Badge>
                  {" "}
                  <Icon
                    type={"usergroup-delete"}
                    style={{ fontSize: "24px", color: "#934" }}
                  />
                </Badge>
              </a>
            </Dropdown>
          );
        }}
      </Query>
    );
  }
};

export default MembersDropdown;
