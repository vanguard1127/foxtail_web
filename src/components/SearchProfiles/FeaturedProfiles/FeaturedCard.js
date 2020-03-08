import React, { Component } from "react";
import { ProfileActionBtns, ProfilePic, ProfileInfoDiv } from "../ProfileCard/";

class FeaturedCard extends Component {
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

  goTo = () => {
    this.props.history.push("/member/" + this.props.profile.id);
  };

  render() {
    const {
      profile,
      showMsgModal,
      likeProfile,
      t,
      dayjs,
      liked,
      msgd,
      distanceMetric,
      toggleBlockModalVisible,
      isMobile
    } = this.props;

    let badge = "";
    if (
      profile.users.every(
        user =>
          user.verifications.photoVer.active && user.verifications.stdVer.active
      )
    ) {
      badge = "verified both";
    } else if (profile.users.every(user => user.verifications.stdVer.active)) {
      badge = "verified std";
    } else if (
      profile.users.every(user => user.verifications.photoVer.active)
    ) {
      badge = "verified photo";
    }

    return (
      <div className={"item " + badge}>
        <div className="info">
          <span onClick={this.goTo}>
            <ProfileInfoDiv
              profile={profile}
              t={t}
              dayjs={dayjs}
              distanceMetric={distanceMetric}
            />
            <ProfilePic profilePic={profile.profilePic} />
          </span>
          <div
            className={isMobile ? "removeProfile isMobile" : "removeProfile"}
            onClick={() => toggleBlockModalVisible(profile)}
          ></div>
        </div>
        <ProfileActionBtns
          likeProfile={likeProfile}
          showMsgModal={showMsgModal}
          profile={profile}
          liked={liked}
          msgd={msgd}
          t={t}
          featured={true}
        />
      </div>
    );
  }
}

export default FeaturedCard;
