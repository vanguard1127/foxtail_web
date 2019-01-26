import React from "react";
import moment from "moment";
const preventContextMenu = e => {
  e.preventDefault();
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};
const EventCreator = ({ ownerProfile, createdAt, history, t }) => {
  return (
    <div className="created">
      <span onClick={() => history.push("/members/" + ownerProfile.id)}>
        <span className="avatar">
          <img
            src={
              ownerProfile.profilePic !== ""
                ? ownerProfile.profilePic
                : "/assets/img/usr/avatar/1003@2x.png"
            }
            alt=""
            onContextMenu={preventContextMenu}
          />
        </span>
        <div className="detail">
          <span className="name">{ownerProfile.profileName}</span>
          <span className="created-date">
            {t("createdon")}{" "}
            {moment(createdAt)
              .format("MMM Do")
              .toString()}
          </span>
        </div>
      </span>
    </div>
  );
};

export default EventCreator;
