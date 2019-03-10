import React from 'react';
import ProfileInfoDiv from './ProfileInfoDiv';
import ProfilePic from './ProfilePic';
import ProfileActionBtns from './ProfileActionBtns';

const FeaturedCard = ({ profile, showMsgModal, likeProfile, history, t }) => {
  const stdCheck = profile.users.every(user => user.verifications.std === true);
  const photoCheck = profile.users.every(
    user => user.verifications.photo === true
  );
  let badge = '';
  if (photoCheck) {
    badge = 'verified';
  }
  return (
    <div className={'item ' + badge}>
      <div className="info">
        <span onClick={() => history.push('/member/' + profile.id)}>
          <ProfileInfoDiv profile={profile} t={t} />
          <ProfilePic profilePic={profile.profilePic} />
        </span>
      </div>
      <ProfileActionBtns
        likeProfile={likeProfile}
        showMsgModal={showMsgModal}
        profile={profile}
      />
    </div>
  );
};

export default FeaturedCard;
