import React, { PureComponent } from "react";

class ProfileInfoBox extends PureComponent {
  render() {
    const {
      users,
      online,
      distance,
      t,
      dayjs,
      distanceMetric,
      profileName,
      onClick,
      toggleBlockModalVisible
    } = this.props;

    return (
      <>
        <span
          className={online ? "name online" : "name"}
          title={profileName}
          onClick={onClick}
        >
          {profileName}
        </span>
        <div className={"removeProfile"} onClick={toggleBlockModalVisible} />
        <span className="detail" onClick={onClick}>
          <ul>
            <li className={"sex " + users[0].sex}>
              <span className={"sex " + users[0].sex + " profileCardSymbol"} />
              &nbsp;
              {dayjs().diff(users[0].dob, "years")}
            </li>
            {users[1] && (
              <li className={"sex " + users[1].sex}>
                <span
                  className={"sex " + users[1].sex + " profileCardSymbol"}
                />
                &nbsp;
                {dayjs().diff(users[1].dob, "years")}
              </li>
            )}
            <li>
              ~ {distance} {t(distanceMetric)}
            </li>
          </ul>
        </span>
      </>
    );
  }
}

export default ProfileInfoBox;
