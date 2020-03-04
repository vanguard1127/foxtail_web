import React, { PureComponent } from "react";
import ProfileInfoBox from "./ProfileInfoBox";
import KinksBlock from "../KinksBlock";

class ProfileInfoDiv extends PureComponent {
  render() {
    const { profile, t, dayjs, distanceMetric } = this.props;
    console.log("profile.distance", profile.distance);
    return (
      <div className="data">
        <ProfileInfoBox
          profileName={profile.profileName}
          users={profile.users}
          online={profile.showOnline && profile.online}
          distance={profile.distance}
          t={t}
          dayjs={dayjs}
          distanceMetric={distanceMetric}
        />
        <KinksBlock kinks={profile.kinks} t={t} />
      </div>
    );
  }
}

export default ProfileInfoDiv;
