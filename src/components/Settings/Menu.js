import React from "react";

const ProfilePic = ({ proPic }) => {
  return (
    <div className="profile-picture-content">
      <div className="picture">
        <input type="file" className="filepond upload-avatar" name="filepond" />
      </div>
    </div>
  );
};

export default ProfilePic;
