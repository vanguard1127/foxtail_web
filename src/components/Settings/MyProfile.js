import React from "react";
import DesiresSelector from "../Modals/Desires/Selector";

const MyProfile = ({ desires, about, setValue, togglePopup, t, errors }) => {
  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <span className="heading">{t("myprofile")}</span>
        </div>
        <div className="col-md-12">
          <div className="item">
            <DesiresSelector desires={desires} togglePopup={togglePopup} />
            {errors.desires && (
              <label className="errorLbl">{errors.desires}</label>
            )}
          </div>
        </div>
        <div className="col-md-12">
          <div className="item">
            <div className="textarea">
              <label>{t("probio")}:</label>
              <textarea
                onChange={e =>
                  setValue({
                    name: "about",
                    value: e.target.value
                  })
                }
                value={about}
              />
            </div>
            {errors.about && <label className="errorLbl">{errors.about}</label>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
