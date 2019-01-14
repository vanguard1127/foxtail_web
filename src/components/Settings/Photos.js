import React from "react";
import UploadComponent from "./UploadImageComponent";

const Photos = ({ isPrivate, showEditor, photos, deleteImg, t }) => {
  return (
    <div className="content mtop">
      <div className="row">
        <div className="col-md-12">
          <span className="heading">
            {!isPrivate ? t("Public Photos") : t("Private Photos")}
            <i>
              {" "}
              {!isPrivate
                ? "- " + t("No nudity please")
                : "- " + t("Nudity is OK. Will only show to matches.")}
            </i>
          </span>
        </div>
        <div className="col-md-12">
          <UploadComponent
            max={4}
            showEditor={showEditor}
            photos={photos}
            isPrivate={isPrivate}
            deleteImg={deleteImg}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};

export default Photos;
