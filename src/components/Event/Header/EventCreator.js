import React, { PureComponent } from "react";

const NoProfileImg = require("../../../assets/img/elements/no-profile.png");

class EventCreator extends PureComponent {
  render() {
    const { ownerProfile, createdAt, history, t, dayjs, lang } = this.props;

    return (
      <div
        className="created"
        onClick={() => history.push("/member/" + ownerProfile.id)}
      >
        <span>
          <span className="avatar">
            <img
              src={
                ownerProfile.profilePic !== ""
                  ? ownerProfile.profilePic
                  : NoProfileImg
              }
              alt=""
              
            />
          </span>
          <div className="detail">
            <span className="name" title={ownerProfile.profileName}>
              {ownerProfile.profileName}
            </span>
            <span className="created-date">
              {t("createdon")}{" "}
              {dayjs(createdAt)
                .locale(lang)
                .format("MMMM D YYYY")}
            </span>
          </div>
        </span>
      </div>
    );
  }
}

export default EventCreator;
