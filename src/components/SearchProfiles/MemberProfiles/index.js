import React, { Component } from "react";
import ProfileCard from "./ProfileCard";
import { Waypoint } from "react-waypoint";
import isArrayStringsEqual from "../../../utils/arraysEqual";

class ProfilesDiv extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.profiles !== nextProps.profiles ||
      !isArrayStringsEqual(this.props.likedProfiles, nextProps.likedProfiles) ||
      !isArrayStringsEqual(this.props.msgdProfiles, nextProps.msgdProfiles) ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      profiles,
      showMsgModal,
      likeProfile,
      history,
      handleEnd,
      t,
      dayjs,
      distanceMetric,
      likedProfiles,
      msgdProfiles
    } = this.props;

    return (
      <section className="members">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <span className="head">{t("allmems")}</span>
              </div>
              {profiles.map(profile => {
                return (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    showMsgModal={showMsgModal}
                    likeProfile={likeProfile}
                    t={t}
                    history={history}
                    dayjs={dayjs}
                    distanceMetric={distanceMetric}
                    liked={likedProfiles.includes(profile.id)}
                    msgd={msgdProfiles.includes(profile.id)}
                  />
                );
              })}
              <Waypoint
                onEnter={({ previousPosition, currentPosition }) =>
                  handleEnd({
                    previousPosition,
                    currentPosition
                  })
                }
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ProfilesDiv;
