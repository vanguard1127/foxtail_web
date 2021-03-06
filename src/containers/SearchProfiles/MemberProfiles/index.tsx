import React, { memo } from "react";
import { Waypoint } from "react-waypoint";
import { WithT } from "i18next";

import MemberProfileCard from "./MemberProfileCard";

import "../searchProfiles.css";

interface IMemberProfilesProps extends WithT {
  profiles: any;
  showMsgModal: (profile: any) => void;
  likeProfile: (profile: any) => void;
  history: any;
  handleEnd: any;
  dayjs: any;
  distanceMetric: string;
  likedProfiles: any;
  msgdProfiles: any;
  toggleBlockModalVisible: (profile: any) => void;
  searchType: string;
  setSearchType: any;
  isEmpty: boolean;
}

const MemberProfiles: React.FC<IMemberProfilesProps> = memo(
  ({
    profiles,
    showMsgModal,
    likeProfile,
    history,
    handleEnd,
    t,
    dayjs,
    distanceMetric,
    likedProfiles,
    msgdProfiles,
    toggleBlockModalVisible,
    searchType,
    setSearchType,
    isEmpty
  }) => {
    return (
      <section className="members">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <span
                  className={`head ${searchType === "all" && "selected"}`}
                  onClick={() => setSearchType("all")}
                >
                  {t("allmems")}
                </span>
                <span
                  className={`head ${searchType === "liked" && "selected"}`}
                  onClick={() => setSearchType("liked")}
                >
                  {t("liked")}
                </span>
                <span
                  className={`head ${searchType === "likedMe" && "selected"}`}
                  onClick={() => setSearchType("likedMe")}
                >
                  {t("likedMe")}
                </span>
              </div>
              {isEmpty &&
                profiles.map((profile, idx) => {
                  return (
                    <MemberProfileCard
                      key={profile.id + idx}
                      profile={profile}
                      showMsgModal={showMsgModal}
                      likeProfile={likeProfile}
                      t={t}
                      history={history}
                      dayjs={dayjs}
                      distanceMetric={distanceMetric}
                      liked={likedProfiles.includes(profile.id)}
                      msgd={msgdProfiles.includes(profile.id)}
                      toggleBlockModalVisible={toggleBlockModalVisible}
                    />
                  );
                })}
              <Waypoint
                onEnter={({ previousPosition }) =>
                  handleEnd({ previousPosition })
                }
                topOffset="50px"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
);

export default MemberProfiles;
