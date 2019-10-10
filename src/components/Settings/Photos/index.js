import React, { Component } from "react";
import Tooltip from "../../common/Tooltip";
import UploadComponent from "./UploadImageComponent";

class Photos extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.photos !== nextProps.photos || this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const { isBlackMember, isPrivate, showEditor, showCropper, photos, deleteImg, t, setProfilePic, toggleScroll, ErrorBoundary } = this.props;
    return (
      <ErrorBoundary>
        <div className="content mtop">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">
                {!isPrivate ? t("pubphotos") : t("privphotos")}
                <i> {!isPrivate ? "- " + t("nonude") : "- " + t("nudeok")}</i>{" "}
                <Tooltip
                  title={
                    !isPrivate
                      ? "Public Photos can be seen by all members. *Tip: Add at least one of each: face, upper body, and full body."
                      : "Private Photos can only be seen by members you have matched with. Feel free to share more racy images of yourself."
                  }
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
  }
}

export default Photos;
