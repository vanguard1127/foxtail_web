import React, { memo } from "react";

import ProfileInfoBox from "./ProfileInfoBox";

import KinksBlock from "../KinksBlock";
import { WithT } from "i18next";

interface IProfileInfoDivProps extends WithT {
  profile: any;
  dayjs: any;
  distanceMetric: string;
}

const ProfileInfoDiv: React.FC<IProfileInfoDivProps> = memo(({
  profile,
  t,
  dayjs,
  distanceMetric,
}) => {
  return (
    <div className="data">
      <ProfileInfoBox
        profileName={profile.profileName}
        users={profile.users}
        online={profile.showOnline && profile.online}
        distance={profile.distance}
        distanceMetric={distanceMetric}
        t={t}
        dayjs={dayjs}
      />
      <KinksBlock kinks={profile.kinks} t={t} />
    </div>
  );
})

export default ProfileInfoDiv;
