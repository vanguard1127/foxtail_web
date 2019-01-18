import React from "react";
import moment from "moment";
const ProfileInfo = ({ users, online, t }) => {
  return (
    <div className={online ? "user-info online" : "user-info"}>
      <div>
        <span> {users[0].username},</span>
        <span> {moment().diff(users[0].dob, "years")},</span>
        <span>{t("Bisexual")}</span>
      </div>
      {users[1] && (
        <div>
          <span>{users[1].username},</span>
          <span> {moment().diff(users[1].dob, "years")},</span>
          <span>{t("Bisexual")}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;