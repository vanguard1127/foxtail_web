import React, { PureComponent } from "react";
import ProfileInfoBox from "./ProfileInfoBox";
import DesiresBlock from "../DesiresBlock";

class ProfileInfoDiv extends PureComponent {
  render() {
    const { profile, t, dayjs, distanceMetric } = this.props;
    return (
      <div className="data">
        <ProfileInfoBox
          users={profile.users}
          online={profile.showOnline && profile.online}
          distance={profile.distance}
          t={t}
          dayjs={dayjs}
          distanceMetric={distanceMetric}
        />
        <DesiresBlock desires={profile.desires} t={t} />
      </div>
    );
  }
}

export default ProfileInfoDiv;
