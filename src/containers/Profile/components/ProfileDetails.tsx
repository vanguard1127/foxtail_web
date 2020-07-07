import React from "react";
import { WithT } from "i18next";

import TimeAgo from "utils/TimeAgo";
import Tooltip from "components/common/Tooltip";

import { sexOptions } from "../../../docs/options/en";

interface IProfileDetailsProps extends WithT {
  users: any;
  profile: any;
  showShareModal: () => void;
  showBlockModal: () => void;
  showRemoveModal: () => void;
  showRemove: boolean;
  ErrorBoundary: any;
  distanceMetric: string;
}

const ProfileDetails: React.FC<IProfileDetailsProps> = ({
  users,
  profile,
  showShareModal,
  showBlockModal,
  showRemoveModal,
  showRemove,
  ErrorBoundary,
  distanceMetric,
  t,
}) => {
  let distance = '';
  let distanceUnits = distanceMetric === "mi" ? "common:miaway" : "common:kmaway";

  if (!profile.distance) {
    distance = t("na");
  } else if (profile.distance < 1) {
    distance = `< 1 ${t(distanceUnits)}`;
  } else {
    distance = `${profile.distance} ${t(distanceUnits)}`;
  }
  const lookingFor = profile.interestedIn.map((intrst, idx, arr) => {
    if (idx === arr.length - 1) {
      return t(sexOptions.find(el => el.value === intrst).label);
    }
    return t(sexOptions.find(el => el.value === intrst).label) + ", ";
  });

  return (
    <ErrorBoundary>
      <div className="data-info">
        <ul>
          <li>
            <span className="head">
              {users[1] ? t("common:Sexes") : t("common:Sex")}:
              </span>
            <span className="data sex">
              <span className={"sex " + users[0].sex} />
              {users[1] && <span className={"sex " + users[1].sex} />}
            </span>
          </li>
          <li>
            <span className="head">{t("Distance")}:</span>
            <span className="data">{distance}</span>
          </li>
          <li>
            <span className="head">{t("lookfor")}:</span>
            <Tooltip title={lookingFor} placement="top">
              <span className="data lookfor">
                {lookingFor.length > 0 ? lookingFor : t("ask")}
              </span>
            </Tooltip>
          </li>
          <li>
            <span className="head">{t("lstlogin")}:</span>
            <span className="data">
              {" "}
              {profile.showOnline
                ? profile.online
                  ? t("common:Online")
                  : TimeAgo(profile.updatedAt)
                : t("common:NA")}
            </span>
          </li>
        </ul>
        <div className="functions">
          <div
            className="share btn"
            onClick={showShareModal}
            title={t("Get a free week of Black Membership when someone using your link joins Foxtail.")}
          />
          <div
            className="report btn"
            onClick={showBlockModal}
            title={t("reportmem")}
          />
          {showRemove && (
            <div
              className="remove btn"
              onClick={showRemoveModal}
              title={t("removemem")}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ProfileDetails;
