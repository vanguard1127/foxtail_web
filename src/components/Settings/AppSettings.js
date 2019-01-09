import React from "react";

const AppSettings = ({ proPic }) => {
  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <span className="heading">App Settings</span>
        </div>

        <div className="col-md-12">
          <div className="item">
            <div className="dropdown">
              <select className="js-example-basic-single" name="states[]">
                <option>English</option>
                <option>French</option>
              </select>
              <label>Language</label>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="item">
            <div className="switch-con">
              <div className="sw-head">Show My Profile:</div>
              <div className="sw-btn">
                <div className="switch">
                  <input type="checkbox" id="show_profile" checked />
                  <label htmlFor="show_profile" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="item">
            <div className="switch-con">
              <div className="sw-head">Receive E-mails:</div>
              <div className="sw-btn">
                <div className="switch">
                  <input type="checkbox" id="rec_email" checked />
                  <label htmlFor="rec_email" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="item">
            <div className="switch-con">
              <div className="sw-head">Hide Online Status (Black only):</div>
              <div className="sw-btn">
                <div className="switch">
                  <input type="checkbox" id="hide_online_status" checked />
                  <label htmlFor="hide_online_status" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="item">
            <div className="switch-con">
              <div className="sw-head">Only show me to members I liked:</div>
              <div className="sw-btn">
                <div className="switch">
                  <input type="checkbox" id="ilikeds" checked />
                  <label htmlFor="ilikeds" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
