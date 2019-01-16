import React from "react";
import { genderOptions } from "../../docs/data";
import TimeAgo from "../../utils/TimeAgo";
const ProfileDetails = ({
  users,
  profile,
  showShareModal,
  showBlockModal,
  t
}) => {
  let distance;
  if (profile.distance === null) {
    distance = t("na");
  } else if (profile.distance < 1) {
    distance = "< 1" + t("common:" + "miaway");
  } else {
    distance = profile.distance + t("common:" + "miaway");
  }

  return (
    <div className="data-info">
      <ul>
        <li>
          <span className="head">{t("Gender")}:</span>
          <span className="data">
            {genderOptions.find(el => el.value === users[0].gender).label}
            {users[1] &&
              genderOptions.find(el => el.value === users[1].gender).label}
          </span>
        </li>
        <li>
          <span className="head">{t("Distance")}:</span>
          <span className="data">{distance}</span>
        </li>
        <li>
          <span className="head">{t("lookfor")}:</span>
          <span className="data">
            {profile.interestedIn.map((intrst, idx, arr) => {
              if (idx === arr.length - 1) {
                return t(genderOptions.find(el => el.value === intrst).label);
              }

              return (
                t(genderOptions.find(el => el.value === intrst).label) + ", "
              );
            })}
          </span>
        </li>
        <li>
          <span className="head">{t("lstlogin")}:</span>
          <span className="data">
            {" "}
            {profile.online ? t("common:Online") : TimeAgo(profile.updatedAt)}
          </span>
          <div className="share btn" onClick={() => showShareModal()}>
            <button>{t("Share")}</button>
          </div>
          <div className="report btn" onClick={() => showBlockModal()}>
            <button>{t("Report")}</button>
          </div>
        </li>
      </ul>
      <div className="functions">
        <div className="share btn" onClick={() => showShareModal()}>
          <button>{t("Share")}</button>
        </div>
        <div className="report btn" onClick={() => showBlockModal()}>
          <button>{t("Report")}</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
