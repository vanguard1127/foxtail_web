import React from "react";
import { genderOptions } from "../../docs/data";
import TimeAgo from "../../utils/TimeAgo";
const ProfileDetails = ({ users, profile, showShareModal, showBlockModal }) => {
  let distance;
  if (profile.distance === null) {
    distance = "N/A";
  } else if (profile.distance < 1) {
    distance = "< 1 mil away";
  } else {
    distance = profile.distance;
  }

  return (
    <div className="data-info">
      <ul>
        <li>
          <span className="head">Gender:</span>
          <span className="data">
            {genderOptions.find(el => el.value === users[0].gender).value}
            {users[1] &&
              genderOptions.find(el => el.value === users[1].gender).value}
          </span>
        </li>
        <li>
          <span className="head">Distance:</span>
          <span className="data">{distance}</span>
        </li>
        <li>
          <span className="head">Looking For:</span>
          <span className="data">
            {profile.interestedIn.map(
              interest =>
                genderOptions.find(el => el.value === interest).value + ", "
            )}
          </span>
        </li>
        <li>
          <span className="head">Last Login:</span>
          <span className="data"> {TimeAgo(profile.updatedAt)}</span>
        </li>
      </ul>
      <div className="functions">
        <div className="share btn">
          <span onClick={() => showShareModal()} />
        </div>
        <div className="report btn">
          <span onClick={() => showBlockModal()} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
