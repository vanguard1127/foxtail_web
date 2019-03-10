import React from 'react';
import ProfilePic from './ProfilePic';
import DesiresBlock from './DesiresBlock';
import ProfileActionBtns from './ProfileActionBtns';
import ProfileInfoBox from './ProfileInfoBox';

const ProfileCard = ({ profile, showMsgModal, likeProfile, history, t }) => {
  const stdCheck = profile.users.every(user => user.verifications.std === true);
  const photoCheck = profile.users.every(
    user => user.verifications.photo === true
  );
  let badge = '';
  if (photoCheck) {
    badge = 'verified';
  }
  return (
    <div className="col-md-6 col-lg-4">
      <div className={'card-item ' + badge}>
        <span onClick={() => history.push('/member/' + profile.id)}>
          <ProfilePic profilePic={profile.profilePic} />
        </span>
        <div className="info">
          <span onClick={() => history.push('/member/' + profile.id)}>
            <ProfileInfoBox
              users={profile.users}
              online={profile.showOnline && profile.online}
              distance={profile.distance}
              t={t}
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
};

export default ProfileCard;
