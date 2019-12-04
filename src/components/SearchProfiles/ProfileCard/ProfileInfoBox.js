import React, { PureComponent } from "react";
import milesToKilometers from "../../../utils/distanceMetric";

class ProfileInfoBox extends PureComponent {
  render() {
    const {
      users,
      online,
      distance,
      t,
      dayjs,
      distanceMetric,
      profileName
    } = this.props;

    return (
      <>
        <span className={online ? "name online" : "name"} title={profileName}>
          {profileName}
        </span>
        <span className="detail">
          <ul>
            <li className={"sex " + users[0].sex}>
              <span
                className={"sex " + users[0].sex + " profileCardSymbol"}
              />
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
              ~ {milesToKilometers(distance, distanceMetric)}{" "}
              {t(distanceMetric)}
            </li>
          </ul>
        </span>
      </>
    );
  }
}

export default ProfileInfoBox;
