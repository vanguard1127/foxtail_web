import React, { Component } from "react";
import ProfileInfoDiv from "./ProfileInfoDiv";
import ProfilePic from "./ProfilePic";
import ProfileActionBtns from "./ProfileActionBtns";

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
    console.log("FC");

    const {
      profile,
      showMsgModal,
      likeProfile,
      history,
      t,
      dayjs,
      liked,
      msgd
    } = this.props;

    const stdCheck = profile.users.every(
      user => user.verifications.std === true
    );
    const photoCheck = profile.users.every(
      user => user.verifications.photo === true
    );
    let badge = "";
    if (photoCheck) {
      badge = "verified";
    }
    return (
      <div className={"item " + badge}>
        <div className="info">
          <span onClick={() => history.push("/member/" + profile.id)}>
            <ProfileInfoDiv profile={profile} t={t} dayjs={dayjs} />
            <ProfilePic profilePic={profile.profilePic} />
          </span>
        </div>
        <ProfileActionBtns
          likeProfile={likeProfile}
          showMsgModal={showMsgModal}
          profile={profile}
          liked={liked}
          msgd={msgd}
        />
      </div>
    );
  }
}

export default FeaturedCard;
