import React from "react";
import DesiresSelector from "../Modals/Desires/Selector";

const MyProfile = ({ desires, about, setValue, togglePopup }) => {
  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <span className="heading">My Profile</span>
        </div>
        <div className="col-md-12">
          <div className="item">
            <DesiresSelector desires={desires} togglePopup={togglePopup} />
          </div>
        </div>
        <div className="col-md-12">
          <div className="item">
            <div className="textarea">
              <label>Profile Bio:</label>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
