import React from "react";
import UploadComponent from "./UploadImageComponent";

const Photos = ({ isPrivate, showEditor, photos, deleteImg }) => {
  return (
    <div className="content mtop">
      <div className="row">
        <div className="col-md-12">
          <span className="heading">
            {!isPrivate ? "Public Photos" : "Private Photos"}
            <i>
              {" "}
              {!isPrivate
                ? "- (No nudity please)"
                : "- (Nudity is OK. Will only show to matches.)"}
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
          />
        </div>
      </div>
    </div>
  );
};

export default Photos;
