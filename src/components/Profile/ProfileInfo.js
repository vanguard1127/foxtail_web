import React from "react";
import moment from "moment";
import TimeAgo from "../../utils/TimeAgo";
const ProfileInfo = ({ users, updatedAt }) => {
  return (
    <div
      className={
        TimeAgo(updatedAt) === "Online" ? "user-info online" : "user-info"
      }
    >
      <div>
        <span> {users[0].username},</span>
        <span> {moment().diff(users[0].dob, "years")},</span>
        <span>Bisexual</span>
      </div>
      {users[1] && (
        <div>
          <span>{users[1].username},</span>
          <span> {moment().diff(users[1].dob, "years")},</span>
          <span>Bisexual</span>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
