import React, { PureComponent } from "react";
import milesToKilometers from "../../utils/distanceMetric";

class ProfileInfoBox extends PureComponent {
  render() {
    const { users, online, distance, t, dayjs, distanceMetric } = this.props;

    return (
      <>
        <span className={online ? "name online" : "name"}>
          {users[0].username}
          {users[1] && "&" + users[1].username}
        </span>
        <span className="detail">
          <ul>
            <li className={"gender " + users[0].gender}>
              {dayjs()
                .locale(localStorage.getItem("i18nextLng"))
                .diff(users[0].dob, "years")}
            </li>
            {users[1] && (
              <li className={"gender " + users[1].gender}>
                {dayjs()
                  .locale(localStorage.getItem("i18nextLng"))
                  .diff(users[1].dob, "years")}
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
