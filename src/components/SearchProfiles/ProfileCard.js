import React, { Component } from "react";
import ProfilePic from "./ProfilePic";
import DesiresBlock from "./DesiresBlock";
import ProfileActionBtns from "./ProfileActionBtns";
import ProfileInfoBox from "./ProfileInfoBox";

class ProfileCard extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.profile !== nextProps.profile) {
      return true;
    }
    return false;
  }

  onMemberClick = () => {
    const { profile, history } = this.props;
    const { id } = profile;
    history.push("/member/" + id);
  };

  render() {
    const {
      profile,
      showMsgModal,
      likeProfile,
      t,
      dayjs,
      distanceMetric
    } = this.props;

    const stdCheck = profile.users.every(
      user => user.verifications.std === true
    );
    const photoCheck = profile.users.every(
      user => user.verifications.photo === true
    );
    let badge = "";
    if (photoCheck) badge = "verified";

    return (
      <div className="col-md-6 col-lg-4">
        <div className={"card-item " + badge}>
          <span onClick={this.onMemberClick}>
            <ProfilePic profilePic={profile.profilePic} />
          </span>
          <div className="info">
            <span onClick={this.onMemberClick}>
              <ProfileInfoBox
                users={profile.users}
                online={profile.showOnline && profile.online}
                distance={profile.distance}
                t={t}
                dayjs={dayjs}
                distanceMetric={distanceMetric}
              />
            </span>
            <DesiresBlock desires={profile.desires} t={t} id={profile.id} />
            <ProfileActionBtns
              profile={profile}
              likeProfile={likeProfile}
              showMsgModal={showMsgModal}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileCard;
