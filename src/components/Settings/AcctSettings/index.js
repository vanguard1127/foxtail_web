import React, { Component } from "react";
import Dialog from "../../Modals/Dialog";
import RequestEmailVerBtn from "./RequestEmailVerBtn";
import ChangePhoneBtn from "./ChangePhoneBtn";
import * as yup from "yup";
class AcctSettings extends Component {
  state = {
    showDialog: false,
    msg: "",
    btnText: "",
    title: "",
    setting: "",
    successMsg: "",
    placeholder: ""
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state !== nextState ||
      this.props.t !== nextProps.t ||
      this.props.passEnabled !== nextProps.passEnabled
    ) {
      return true;
    }
    return false;
  }
  toggleDialog = () => {
    this.props.ErrorHandler.setBreadcrumb("Dialog Modal Toggled:");
    this.setState({ showDialog: !this.state.showDialog });
  };

  setDialogContent = ({
    title,
    msg,
    btnText,
    setting,
    successMsg,
    placeholder
  }) => {
    this.setState({
      title,
      msg,
      btnText,
      setting,
      placeholder,
      successMsg: successMsg || null,
      showDialog: !this.state.showDialog
    });
  };

  toggleEnablePass = () => {
    const { t } = this.props;
    if (!this.props.passEnabled) {
      const title = t("2faenable");
      const msg = t("2faenabledes");
      const btnText = t("common:Save");
      const setting = "password";
      const successMsg = t("2fasuccess");
      const placeholder = t("2faplaceholder");

      this.setDialogContent({
        title,
        msg,
        btnText,
        setting,
        successMsg,
        placeholder
      });
    } else {
      this.props.setValue({ name: "password", value: null });
    }
  };

  render() {
    const {
      ErrorHandler,
      t,
      setValue,
      lang,
      isEmailOK,
      ReactGA,
      passEnabled
    } = this.props;
    const {
      showDialog,
      title,
      msg,
      btnText,
      setting,
      successMsg,
      placeholder
    } = this.state;
    let schema;
    if (setting === "email") {
      schema = yup.object().shape({
        text: yup
          .string()
          .email(t("invemail"))
          .required(t("emailreq"))
      });
    } else if (setting === "username") {
      schema = yup.object().shape({
        text: yup.string().required(t("unreq"))
      });
    } else if (setting === "gender") {
      schema = yup.object().shape({
        text: yup.string().required(t("genreq"))
      });
    } else if (setting === "password") {
      schema = yup.object().shape({
        text: yup.string().max(30, "usernameLen")
      });
    } else {
      schema = yup.object().shape({
        text: yup.string()
      });
    }

    return (
      <ErrorHandler.ErrorBoundary>
        <div className="content mtop">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">{t("acctsetting")}</span>
            </div>
            <div className="col-md-6">
              <div className="switch-con no-border">
                <div className="sw-head">{t("2faenable")}:</div>
                <div className="sw-btn">
                  <div className="switch">
                    <input
                      type="checkbox"
                      id="passEnabled"
                      checked={passEnabled ? true : false}
                      onChange={this.toggleEnablePass}
                    />
                    <label htmlFor="passEnabled" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6"></div>
            <div className="col-md-6">
              <div className="verification-box">
                <span
                  className="clickverify-btn"
                  onClick={() => {
                    const title = t("updemail");
                    const msg = t("updemaildes");
                    const btnText = t("common:Update");
                    const setting = "email";
                    const successMsg = t("emailupdsuccess");
                    const placeholder = t("emailplaceholder");

                    this.setDialogContent({
                      title,
                      msg,
                      btnText,
                      setting,
                      successMsg,
                      placeholder
                    });
                  }}
                >
                  {t("updemail")}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <ChangePhoneBtn
                t={t}
                ErrorHandler={ErrorHandler}
                lang={lang}
                ReactGA={ReactGA}
              />
            </div>
            <div className="col-md-6">
              <div className="verification-box">
                <span
                  className="clickverify-btn"
                  onClick={() => {
                    const title = t("usrupd");
                    const msg = t("usrupddes");
                    const btnText = t("common:Update");
                    const setting = "username";
                    const placeholder = t("unplaceholder");
                    this.setDialogContent({
                      title,
                      msg,
                      btnText,
                      setting,
                      successMsg,
                      placeholder
                    });
                  }}
                >
                  {t("usrupd")}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="verification-box">
                <span
                  className="clickverify-btn"
                  onClick={() => {
                    const title = t("updgen");
                    const msg = t("updgendes");
                    const btnText = t("common:Update");
                    const setting = "gender";
                    this.setDialogContent({
                      title,
                      msg,
                      btnText,
                      setting,
                      successMsg
                    });
                  }}
                >
                  {t("chngsex")}
                </span>
              </div>
            </div>

            {!isEmailOK && (
              <div className="col-md-12">
                <div className="verification-box">
                  <RequestEmailVerBtn
                    t={t}
                    ErrorHandler={ErrorHandler}
                    ReactGA={ReactGA}
                  />
                </div>
              </div>
            )}
          </div>
          {showDialog && (
            <Dialog
              close={() => this.toggleDialog()}
              ErrorBoundary={ErrorHandler.ErrorBoundary}
              title={title}
              msg={msg}
              btnText={btnText}
              successMsg={successMsg}
              schema={schema}
              setValue={value => {
                setValue({ name: setting, value });
              }}
              specialType={setting}
              placeholder={placeholder}
              className="acctsetting"
            />
          )}
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default AcctSettings;
