import React, { Component } from "react";
import Tooltip from "../common/Tooltip";
import Dropdown from "../common/Dropdown";
import i18n from "../../i18n";

const setLang = lang => {
  i18n.changeLanguage(lang);
};

class AppSettings extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.visible !== nextProps.visible ||
      this.props.lang !== nextProps.lang ||
      this.props.emailNotify !== nextProps.emailNotify ||
      this.props.showOnline !== nextProps.showOnline ||
      this.props.isBlackMember !== nextProps.isBlackMember ||
      this.props.likedOnly !== nextProps.likedOnly ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }
  warnBlk = () => {
    const { toast, t } = this.props;
    if (!toast.isActive("warnblk")) {
      toast.info(t("onlyavailblk"), {
        toastId: "warnblk"
      });
    }
  };
  render() {
    const {
      setValue,
      visible,
      lang,
      emailNotify,
      showOnline,
      likedOnly,
      t,
      ErrorBoundary,
      isBlackMember
    } = this.props;

    return (
      <ErrorBoundary>
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">
                {t("appsetting")}{" "}
                <Tooltip
                  title={
                    <div>
                      <div>{t("Settings")}</div>
                      <div>
                        <ul>
                          <li>{t("showmyprofile")}</li>
                          <li>{t("recvemail")}</li>
                          <li>{t("showonl")}</li>
                          <li>{t("visiblelike")}</li>
                        </ul>
                      </div>
                    </div>
                  }
                  placement="left-start"
                >
                  <span className="tip" />
                </Tooltip>
              </span>
            </div>

            <div className="col-md-12">
              <div className="item">
                <Dropdown
                  value={lang}
                  type={"lang"}
                  onChange={async e => {
                    if (e.value !== lang) {
                      await setLang(e.value);
                      await setValue({
                        name: "lang",
                        value: e.value
                      });
                      window.location.reload(false);
                    }
                  }}
                  placeholder={t("langlbl")}
                  lang={lang}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="item">
                <div className="switch-con">
                  <div className="sw-head">{t("showprofile")}:</div>
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
                  <div className="sw-head">{t("recivemails")}:</div>
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
                  <div className="sw-head blk">
                    <Tooltip title="Black Members Only" placement="top">
                      <span className="blkIcon" />
                    </Tooltip>
                    {t("hideonline")}:
                  </div>
                  <div className="sw-btn">
                    <div
                      className="switch"
                      onClick={e => !isBlackMember && this.warnBlk()}
                    >
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
                        disabled={!isBlackMember}
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
                  <div className="sw-head blk">
                    <Tooltip title="Black Members Only" placement="top">
                      <span className="blkIcon" />
                    </Tooltip>
                    {t("onlyshow")}:
                  </div>
                  <div className="sw-btn">
                    <div
                      className="switch"
                      onClick={e => !isBlackMember && this.warnBlk()}
                    >
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
                        disabled={!isBlackMember}
                      />
                      <label htmlFor="ilikeds" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default AppSettings;
