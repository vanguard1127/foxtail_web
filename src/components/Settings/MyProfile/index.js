import React, { Component } from "react";
import Tooltip from "../../common/Tooltip";
import DesiresSelector from "../../Modals/Desires/Selector";
import Dropdown from "../../common/Dropdown";
import BioTextBox from "./BioTextBox";

class MyProfile extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.desires !== nextProps.desires ||
      this.props.sexuality !== nextProps.sexuality ||
      this.props.lang !== nextProps.lang ||
      this.props.about !== nextProps.about ||
      this.props.togglePopup !== nextProps.togglePopup ||
      this.props.errors.about !== nextProps.errors.about ||
      this.props.errors.desires !== nextProps.errors.desires ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      desires,
      about,
      setValue,
      togglePopup,
      lang,
      sexuality,
      t,
      errors,
      ErrorBoundary
    } = this.props;

    return (
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">
              {t("myprofile")}
              <Tooltip title={t("selecthonest")} placement="left-start">
                <span className="tip" />
              </Tooltip>
            </span>
          </div>
          <div className="col-md-12">
            <div className="item">
              <DesiresSelector
                t={t}
                desires={desires}
                togglePopup={togglePopup}
                ErrorBoundary={ErrorBoundary}
              />
              {errors.desires && (
                <label className="errorLbl">{errors.desires}</label>
              )}
            </div>
          </div>
          <div className="col-md-12">
            <div className="item">
              <BioTextBox
                t={t}
                setValue={setValue}
                ErrorBoundary={ErrorBoundary}
                about={about}
              />
              {errors.about && (
                <label className="errorLbl">{errors.about}</label>
              )}
            </div>
          </div>
          <div className="col-md-12">
            <div className="item">
              <Dropdown
                value={sexuality}
                type={"sexuality"}
                onChange={async e => {
                  await setValue({
                    name: "sexuality",
                    value: e.value
                  });
                }}
                placeholder={t("sexlbl")}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyProfile;
