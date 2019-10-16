import React, { Component } from "react";
import { sexOptions } from "../../docs/options/en";
import TimeAgo from "../../utils/TimeAgo";
import Tooltip from "../common/Tooltip";
class ProfileDetails extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const {
      users,
      profile,
      showShareModal,
      showBlockModal,
      t,
      ErrorBoundary,
      distanceMetric
    } = this.props;
    let distance;
    let distanceUnits =
      distanceMetric === "mi" ? "common:miaway" : "common:kmaway";

    if (profile.distance === null) {
      distance = t("na");
    } else if (profile.distance < 1) {
      distance = "< 1 " + t(distanceUnits);
    } else {
      distance = profile.distance + " " + t(distanceUnits);
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
              <span className="data gender">
                <span className={"sex " + users[0].gender} />
                {users[1] && <span className={"sex " + users[1].gender} />}
              </span>
            </li>
            <li>
              <span className="head">{t("Distance")}:</span>
              <span className="data">{distance}</span>
            </li>
            <li>
              <span className="head">{t("lookfor")}:</span>
              <Tooltip title={lookingFor} placement="top">
                <span className="data lookfor">{lookingFor}</span>
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
              title={t(
                "Get a free week of Black Membership when someone using your link joins Foxtail."
              )}
            />
            <div className="report btn" onClick={showBlockModal} />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default ProfileDetails;
