import React, { Component } from "react";
import { Dropdown, Icon, Badge } from "antd";
import { GET_FRIENDS } from "../../queries";
import { Query } from "react-apollo";
import Spinner from "./Spinner";
import FriendsList from "./FriendsList";
const LIMIT = 5;
class FriendsDropdown extends Component {
  render() {
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

          const friends = data.getFriends;
          return (
            <Dropdown
              overlay={
                <FriendsList
                  friends={friends}
                  fetchMore={fetchMore}
                  isEvent={this.props.isEvent}
                  targetID={this.props.targetID}
                  isRemove={this.props.isRemove}
                />
              }
              trigger={["click"]}
              placement="bottomRight"
            >
              <a className="ant-dropdown-link" href="#">
                <Badge>
                  {" "}
                  <Icon
                    type={
                      this.props.isRemove ? "usergroup-delete" : "usergroup-add"
                    }
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
}

export default FriendsDropdown;
