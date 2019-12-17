import React, { useState } from "react";
import NoProfileImg from "../../../assets/img/elements/no-profile.png";

const EventCreator = ({ ownerProfile, createdAt, history, t, dayjs, lang }) => {
  const [proPic, setPropic] = useState(ownerProfile.profilePic);
  return (
    <div
      className="created"
      onClick={() => history.push("/member/" + ownerProfile.id)}
    >
      <span>
        <span className="avatar">
          <img
            src={proPic}
            alt=""
            onError={() => {
              setPropic(NoProfileImg);
            }}
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
};

export default EventCreator;
