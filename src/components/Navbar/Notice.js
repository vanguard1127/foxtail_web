import React from "react";
import { preventContextMenu } from "../../utils/image";
const NoProfileImg = require("../../assets/img/elements/no-profile.png");

const Notice = ({ notice, t, dayjs, lang, setAlert, markReadAndGo }) => {
  if (notice.type === "alert") {
    return (
      <div
        className={notice.read ? "item read" : "item unread"}
        key={notice.id}
        onClick={() => setAlert({ alert: notice })}
      >
        <span>
          <span className="avatar">
            <img src={NoProfileImg} alt="" onContextMenu={preventContextMenu} />
          </span>
          <div>
            <span className="text">
              {notice.name && notice.name + " "}
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
  } else if (!notice.fromProfile) {
    return null;
  } else {
    return (
      <div
        className={notice.read ? "item read" : "item unread"}
        key={notice.id}
        onClick={() =>
          markReadAndGo({
            notificationIDs: [notice.id],
            targetID: notice.targetID,
            type: notice.type
          })
        }
      >
        <span>
          <span className="avatar">
            <img
              src={
                notice.fromProfile
                  ? notice.fromProfile.profilePic
                  : NoProfileImg
              }
              onContextMenu={preventContextMenu}
              className="avatar"
              alt="avatar"
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
