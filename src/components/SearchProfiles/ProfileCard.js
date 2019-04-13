import React, { Component } from "react";
import ProfilePic from "./ProfilePic";
import DesiresBlock from "./DesiresBlock";
import ProfileActionBtns from "./ProfileActionBtns";
import ProfileInfoBox from "./ProfileInfoBox";

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
      msgd
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
              liked={liked}
              msgd={msgd}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileCard;
