import React from "react";
import Tooltip from "../../common/Tooltip";
import UploadComponent from "./UploadImageComponent";

const Photos = ({
  isBlackMember,
  isPrivate,
  showEditor,
  showCropper,
  photos,
  deleteImg,
  t,
  setProfilePic,
  toggleScroll,
  ErrorBoundary
}) => {
  return (
    <ErrorBoundary>
      <div className="content mtop">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">
              {!isPrivate ? t("pubphotos") : t("privphotos")}
              <i>{!isPrivate ? "- " + t("nonude") : "- " + t("nudeok")}</i>
              <Tooltip
                title={!isPrivate ? t("publictitle") : t("prvtitle")}
                placement="left-start"
              >
                <span className="tip" />
              </Tooltip>
            </span>
          </div>
          <div className="col-md-12">
            <UploadComponent
              setProfilePic={setProfilePic}
              max={7}
              showEditor={showEditor}
              showCropper={showCropper}
              photos={photos}
              isPrivate={isPrivate}
              deleteImg={deleteImg}
              isBlackMember={isBlackMember}
              toggleScroll={toggleScroll}
              t={t}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Photos;
