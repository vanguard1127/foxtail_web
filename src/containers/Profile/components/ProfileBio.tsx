import React from "react";
import { WithT } from "i18next";

interface IProfileBioProps extends WithT {
  about: any;
  ErrorBoundary: any;
}

const ProfileBio: React.FC<IProfileBioProps> = ({
  about,
  ErrorBoundary,
  t,
}) => (
    <ErrorBoundary>
      <div className="user-bio">
        <div className="profile-head">{t("bio")}</div>
        <p>{about ? about : t("nobiomsg")}</p>
      </div>
    </ErrorBoundary>
  );

export default ProfileBio;
