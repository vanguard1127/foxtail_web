import React from "react";
import Select from "../common/Select";

const AppSettings = ({
  setValue,
  values: { visible, lang, emailNotify, showOnline, likedOnly }
}) => {
  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <span className="heading">App Settings</span>
        </div>

        <div className="col-md-12">
          <div className="item">
            <Select
              onChange={e => {
                setValue({
                  name: "lang",
                  value: e.value
                });
              }}
              label="Language"
              defaultOptionValue={lang}
              options={[
                { label: "English", value: "en" },
                { label: "Spanish", value: "es" },
                { label: "French", value: "fr" },
                { label: "German", value: "de" }
              ]}
              className={"dropdown"}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="item">
            <div className="switch-con">
              <div className="sw-head">Show My Profile:</div>
              <div className="sw-btn">
                <div className="switch">
                  <input
                    type="checkbox"
                    id="show_profile"
                    checked={visible ? true : false}
                    onChange={e => {
                      setValue({
                        name: "visible",
                        value: !visible ? true : false
                      });
                    }}
                  />
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
                  <input
                    type="checkbox"
                    id="rec_email"
                    checked={emailNotify ? true : false}
                    onChange={e => {
                      setValue({
                        name: "emailNotify",
                        value: !emailNotify ? true : false
                      });
                    }}
                  />
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
                  <input
                    type="checkbox"
                    id="hide_online_status"
                    checked={showOnline ? true : false}
                    onChange={e => {
                      setValue({
                        name: "showOnline",
                        value: !showOnline ? true : false
                      });
                    }}
                  />
                  <label htmlFor="hide_online_status" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="item">
            <div className="switch-con">
              <div className="sw-head">
                Only show me to members I liked (Black only):
              </div>
              <div className="sw-btn">
                <div className="switch">
                  <input
                    type="checkbox"
                    id="ilikeds"
                    checked={likedOnly ? true : false}
                    onChange={e => {
                      setValue({
                        name: "likedOnly",
                        value: !likedOnly ? true : false
                      });
                    }}
                  />
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
