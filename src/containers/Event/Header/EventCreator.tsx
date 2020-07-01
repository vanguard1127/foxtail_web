import React, { useState } from "react";

import NoProfileImg from "assets/img/elements/no-profile.png";

interface IEventCreator {
  ownerProfile: any;
  createdAt: string;
  history: any;
  t: any;
  dayjs: any;
  lang: string;
}

const EventCreator: React.FC<IEventCreator> = ({
  ownerProfile,
  createdAt,
  history,
  t,
  dayjs,
  lang
}) => {
  const [proPic, setPropic] = useState(ownerProfile.profilePic);

  const setErrorPic = () => {
    setPropic(NoProfileImg);
  };

  const goToProfile = () => {
    history.push("/member/" + ownerProfile.id);
  };

  return (
    <div className="created" onClick={goToProfile}>
      <span>
        <span className="avatar">
          <img src={proPic} alt="" onError={setErrorPic} />
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
