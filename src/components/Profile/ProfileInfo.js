import React, { Component } from "react";
import { sexualityOptions } from "../../docs/options/en";

class ProfileInfo extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { users, online, t, dayjs, ErrorBoundary } = this.props;
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
            <span>
              {users[0] && (
                <span
                  className={"sex " + users[0].gender + " userInfoHeader"}
                />
              )}
              &nbsp;
              {users[0].username},&nbsp;{" "}
            </span>
            <span>
              {" "}
              {dayjs()
                .locale(localStorage.getItem("i18nextLng"))
                .diff(users[0].dob, "years")}
            </span>
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
                    className={"sex " + users[1].gender + " userInfoHeader"}
                  />
                )}
                &nbsp; {users[1].username},&nbsp;{" "}
              </span>
              <span>
                {" "}
                {dayjs()
                  .locale(localStorage.getItem("i18nextLng"))
                  .diff(users[1].dob, "years")}
              </span>
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
