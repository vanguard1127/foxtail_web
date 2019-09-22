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
            <li className={"gender " + users[0].gender}>
              <span
                className={"sex " + users[0].gender + " profileCardSymbol"}
              />
              &nbsp;
              {dayjs().diff(users[0].dob, "years")}
            </li>
            {users[1] && (
              <li className={"gender " + users[1].gender}>
                <span
                  className={"sex " + users[1].gender + " profileCardSymbol"}
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
