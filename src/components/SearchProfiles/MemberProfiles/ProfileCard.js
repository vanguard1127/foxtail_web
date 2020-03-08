import React, { Component } from "react";
import KinksBlock from "../KinksBlock";
import { ProfileActionBtns, ProfileInfoBox, ProfilePic } from "../ProfileCard/";

class ProfileCard extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.profile !== nextProps.profile ||
      this.props.liked !== nextProps.liked ||
      this.props.msgd !== nextProps.msgd
    ) {
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
      distanceMetric,
      liked,
      msgd,
      toggleBlockModalVisible,
      isMobile
    } = this.props;
    const stdCheck = profile.users.every(
      user => user.verifications.stdVer.active === true
    );
    const photoCheck = profile.users.every(
      user => user.verifications.photoVer.active === true
    );

    let badge = "";
    if (photoCheck && stdCheck) {
      badge = "verified both";
    } else if (photoCheck) {
      badge = "verified photo";
    } else if (stdCheck) {
      badge = "verified std";
    }

    return (
      <div className="col-md-6 col-lg-4">
        <div className={"card-item " + badge}>
          <span onClick={this.onMemberClick}>
            <ProfilePic profilePic={profile.profilePic} />
          </span>
          <div
            className={isMobile ? "removeProfile isMobile" : "removeProfile"}
            onClick={() => toggleBlockModalVisible(profile)}
          ></div>
          <div className="info">
            <span onClick={this.onMemberClick} className="profile-info">
              <ProfileInfoBox
                profileName={profile.profileName}
                users={profile.users}
                online={profile.showOnline && profile.online}
                distance={profile.distance}
                t={t}
                dayjs={dayjs}
                distanceMetric={distanceMetric}
              />
              <KinksBlock kinks={profile.kinks} t={t} id={profile.id} />
            </span>
            <ProfileActionBtns
              profile={profile}
              likeProfile={likeProfile}
              showMsgModal={showMsgModal}
              liked={liked}
              msgd={msgd}
              t={t}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileCard;
