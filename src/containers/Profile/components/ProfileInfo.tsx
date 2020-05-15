import React from "react";

import Tooltip from "components/common/Tooltip";

import { sexualityOptions } from "../../../docs/options/en";

interface IProfileInfoProps {
  profileName: string;
  users: any;
  online: boolean;
  dayjs: any;
  ErrorBoundary: any;
}

const ProfileInfo: React.FC<IProfileInfoProps> = ({
  profileName,
  users,
  online,
  dayjs,
  ErrorBoundary,
}) => {
  return (
    <ErrorBoundary>
      <div className={`user-info${online ? ' online' : ''}${users[1] ? ' couple' : ''}`}>
        <div>
          <Tooltip title={profileName} placement="top">
            <span className="name">
              {users[1] && (<span className={`sex ${users[0].sex} userInfoHeader`} />)}
                &nbsp;{users[0].username},&nbsp;{" "}
            </span>
          </Tooltip>
          <span>{dayjs().diff(users[0].dob, "years")}</span>
          {users[0].sexuality && (
            <span>
              ,&nbsp;
              {sexualityOptions.find(el => el.value === users[0].sexuality).label}
            </span>
          )}
        </div>
        {users[1] && (
          <div>
            <span>
              {users[1] && (<span className={"sex " + users[1].sex + " userInfoHeader"} />)}
                &nbsp;{users[1].username},&nbsp;{" "}
            </span>
            <span> {dayjs().diff(users[1].dob, "years")}</span>
            {users[1].sexuality && (
              <span>
                ,&nbsp;
                {sexualityOptions.find(el => el.value === users[1].sexuality).label}
              </span>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default ProfileInfo;
