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
  render() {
    const {
      profile,
      showMsgModal,
      likeProfile,
      history,
      t,
      dayjs,
      liked,
      msgd,
      distanceMetric
    } = this.props;

    const stdCheck = profile.users.every(
      user => user.verifications.std === true
    );
    const photoCheck = profile.users.every(
      user => user.verifications.photo === true
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
      <div className={"item " + badge}>
        <div className="info">
          <span onClick={() => history.push("/member/" + profile.id)}>
            <ProfileInfoDiv
              profile={profile}
              t={t}
              dayjs={dayjs}
              distanceMetric={distanceMetric}
            />
            <ProfilePic profilePic={profile.profilePic} />
          </span>
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
