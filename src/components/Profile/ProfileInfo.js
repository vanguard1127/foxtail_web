import React, { Component } from "react";
import { sexualityOptions } from "../../docs/options/en";
import Tooltip from "../common/Tooltip";

class ProfileInfo extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { users, online, dayjs, ErrorBoundary, profileName } = this.props;

    let userInfoStyle = "user-info";
    if (online) {
      userInfoStyle += " online";
    }
    if (users[1]) {
      userInfoStyle += " couple";
    }
    return (
      <ErrorBoundary>
        <div className={userInfoStyle}>
          <div>
            {" "}
            <Tooltip title={profileName} placement="top">
              <span className="name">
                {users[1] && (
                  <span
                    className={"sex " + users[0].sex + " userInfoHeader"}
                  />
                )}
                &nbsp;{users[0].username},&nbsp;{" "}
              </span>
            </Tooltip>
            <span> {dayjs().diff(users[0].dob, "years")}</span>
            {users[0].sexuality && (
              <span>
                ,&nbsp;
                {
                  sexualityOptions.find(el => el.value === users[0].sexuality)
                    .label
                }
              </span>
            )}
          </div>

          {users[1] && (
            <div>
              <span>
                {" "}
                {users[1] && (
                  <span
                    className={"sex " + users[1].sex + " userInfoHeader"}
                  />
                )}
                &nbsp;{users[1].username},&nbsp;{" "}
              </span>

              <span> {dayjs().diff(users[1].dob, "years")}</span>

              {users[1].sexuality && (
                <span>
                  ,&nbsp;
                  {
                    sexualityOptions.find(el => el.value === users[1].sexuality)
                      .label
                  }
                </span>
              )}
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

export default ProfileInfo;
