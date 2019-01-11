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
            {genderOptions.find(el => el.value === users[0].gender).label}
            {users[1] &&
              genderOptions.find(el => el.value === users[1].gender).label}
          </span>
        </li>
        <li>
          <span className="head">Distance:</span>
          <span className="data">{distance}</span>
        </li>
        <li>
          <span className="head">Looking For:</span>
          <span className="data">
            {profile.interestedIn.map((intrst, idx, arr) => {
              if (idx === arr.length - 1) {
                return genderOptions.find(el => el.value === intrst).label;
              }

              return genderOptions.find(el => el.value === intrst).label + ", ";
            })}
          </span>
        </li>
        <li>
          <span className="head">Last Login:</span>
          <span className="data"> {TimeAgo(profile.updatedAt)}</span>
          <div className="share btn" onClick={() => showShareModal()}>
            <button>Share</button>
          </div>
          <div className="report btn" onClick={() => showBlockModal()}>
            <button>Report</button>
          </div>
        </li>
      </ul>
      <div className="functions">
        <div className="share btn" onClick={() => showShareModal()}>
          <button>Share</button>
        </div>
        <div className="report btn" onClick={() => showBlockModal()}>
          <button>Reprot</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
