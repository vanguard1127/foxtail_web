import React, { Component } from "react";

class ProfileInfo extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { users, online, t, dayjs, ErrorBoundary } = this.props;
    return (
      <ErrorBoundary>
        <div className={online ? "user-info online" : "user-info"}>
          <div>
            <span> {users[0].username + ", "} </span>
            <span>
              {" "}
              {dayjs()
                .locale(localStorage.getItem("i18nextLng"))
                .diff(users[0].dob, "years")}
              ,
            </span>
            <span>{t("Bisexual")}</span>
          </div>
          {users[1] && (
            <div>
              <span>{users[1].username},</span>
              <span>
                {" "}
                {dayjs()
                  .locale(localStorage.getItem("i18nextLng"))
                  .diff(users[1].dob, "years")}
                ,
              </span>
              <span>{t("Bisexual")}</span>
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

export default ProfileInfo;
