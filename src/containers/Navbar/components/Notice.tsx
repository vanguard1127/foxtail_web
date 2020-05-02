import React, { useState } from "react";

import NoProfileImg from "assets/img/elements/no-profile.png";

import { IAlertData } from "./NavbarAuth";

interface INoticeProps {
  notice: any;
  t: any;
  dayjs: any;
  lang: string;
  showAlert: (alert: IAlertData) => void;
  markReadAndGo: ({ notificationID, targetID, type }: {
    notificationID: any,
    targetID: any,
    type: any
  }) => void;
  handleCoupleLink: (coupleProID: number | string) => void
}

const Notice: React.FC<INoticeProps> = ({
  notice,
  t,
  dayjs,
  lang,
  showAlert,
  markReadAndGo,
  handleCoupleLink
}) => {
  const [proPic, setPropic] = useState(notice.fromProfile ? notice.fromProfile.profilePic : null);
  const timeFromNow = dayjs(notice.date).locale(lang).fromNow();

  if (notice.type === "alert" || notice.type === "notice") {
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
              {`${notice.name ? `${notice.name} ` : ''}${t(notice.text)}`}
            </span>
            <span className="when">
              {timeFromNow}
            </span>
          </div>
        </span>
      </div>
    );
  }
  if (notice.type === "couple") {
    return (
      <div
        className={notice.read ? "item read" : "item unread"}
        key={notice.id}
        onClick={() => handleCoupleLink(notice.coupleProID)}
      >
        <span>
          <span className="avatar">
            <img src={NoProfileImg} alt="" />
          </span>
          <div>
            <span className="text">
              {`${notice.name} ${t("and you have created a Couple's Profile. Click here to enjoy.")}`}
            </span>
            <span className="when">
              {timeFromNow}
            </span>
          </div>
        </span>
      </div>
    );
  } else if (notice.fromProfile || notice.name) {
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
              src={proPic ? proPic : NoProfileImg}
              alt=""
              onError={() => { setPropic(NoProfileImg); }}
            />
          </span>
          <div>
            <span className="text">
              <b>{`${notice.fromProfile ? notice.fromProfile.profileName : ""} ${notice.name}`}</b>
              {` ${t(notice.text)}${notice.event ? ` ${notice.event}` : ''}`}
            </span>
            <span className="when">
              {timeFromNow}
            </span>
          </div>
        </span>
      </div>
    );
  }

  return null;
};
export default Notice;
