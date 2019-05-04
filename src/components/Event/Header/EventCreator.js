import React, { PureComponent } from "react";
import { preventContextMenu } from "../../../utils/image";
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
