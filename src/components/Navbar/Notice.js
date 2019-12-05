import React, { useState } from "react";
const NoProfileImg = require("../../assets/img/elements/no-profile.png");

const Notice = ({ notice, t, dayjs, lang, showAlert, markReadAndGo }) => {
  const [proPic, setPropic] = useState(
    notice.fromProfile ? notice.fromProfile.profilePic : null
  );
  if (notice.type === "alert") {
    return (
      <div
        className={notice.read ? "item read" : "item unread"}
        key={notice.id}
        onClick={() => showAlert(notice)}
      >
        <span>
          <span className="avatar">
            <img src={NoProfileImg} alt="" />
          </span>
          <div>
            <span className="text">
              {notice.name && notice.name + " "}
              {t(notice.text)}
            </span>
            <span className="when">
              {dayjs(notice.date)
                .locale(lang)
                .fromNow()}
            </span>
          </div>
        </span>
      </div>
    );
  } else if (!notice.fromProfile) {
    return null;
  } else {
    return (
      <div
        className={notice.read ? "item read" : "item unread"}
        key={notice.id}
        onClick={() =>
          markReadAndGo({
            notificationID: notice.id,
            targetID: notice.targetID,
            type: notice.type
          })
        }
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
          <div>
            <span className="text">
              <b>
                {notice.fromProfile ? notice.fromProfile.profileName : ""}
                {notice.name}{" "}
              </b>
              {t(notice.text)}
              {notice.event && " " + notice.event}
            </span>
            <span className="when">
              {dayjs(notice.date)
                .locale(lang)
                .fromNow()}
            </span>
          </div>
        </span>
      </div>
    );
  }
};
export default Notice;
