import React, { Component } from 'react';
import ProfileCard from './ProfileCard';
import Waypoint from 'react-waypoint';

class ProfilesDiv extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.profiles !== nextProps.profiles) {
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
      t
    } = this.props;
    return (
      <section className="members">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <span className="head">{t('allmems')}</span>
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
