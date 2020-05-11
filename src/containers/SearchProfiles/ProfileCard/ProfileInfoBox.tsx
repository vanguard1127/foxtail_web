import React, { memo } from "react";
import { WithT } from "i18next";

interface IProfileInfoBoxProps extends WithT {
  profileName: string;
  users: any;
  online: boolean;
  distance: string;
  distanceMetric: string;
  dayjs: any;
  onClick?: () => void;
  toggleBlockModalVisible?: () => void;
}

const ProfileInfoBox: React.FC<IProfileInfoBoxProps> = memo(({
  profileName,
  users,
  online,
  distance,
  distanceMetric,
  dayjs,
  onClick = () => { },
  toggleBlockModalVisible = () => { },
  t,
}) => {

  const getDiff = (user) => dayjs().diff(user.dob, "years")

  return (
    <React.Fragment>
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
          <li className={`sex ${users[0].sex}`}>
            <span className={`sex ${users[0].sex} profileCardSymbol`} />
              &nbsp;
              {getDiff(users[0])}
          </li>
          {users[1] && (
            <li className={`sex ${users[1].sex}`}>
              <span className={`sex ${users[1].sex} profileCardSymbol`} />
                &nbsp;
              {getDiff(users[1])}
            </li>
          )}
          <li>{`~ ${distance} ${t(distanceMetric)}`}</li>
        </ul>
      </span>
    </React.Fragment>
  );
});

export default ProfileInfoBox;
