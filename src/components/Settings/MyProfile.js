import React from "react";
import DesiresSelector from "../Modals/Desires/Selector";

const MyProfile = ({ desires, updateSettings, about, showPopup }) => {
  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <span className="heading">My Profile</span>
        </div>
        <div className="col-md-12">
          <div className="item">
            <DesiresSelector showPopup={showPopup} desires={desires} />
          </div>
        </div>
        <div className="col-md-12">
          <div className="item">
            <div className="textarea">
              <label>Profile Bio:</label>
              <textarea
                onChange={e =>
                  this.setValue({
                    name: "about",
                    value: e.target.value,
                    updateSettings
                  })
                }
                value={about}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
