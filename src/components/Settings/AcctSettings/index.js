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
    successMsg: ""
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState || this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  toggleDialog = () => {
    this.props.ErrorHandler.setBreadcrumb("Dialog Modal Toggled:");
    this.setState({ showDialog: !this.state.showDialog });
  };

  setDialogContent = ({ title, msg, btnText, setting, successMsg }) => {
    this.setState({
      title,
      msg,
      btnText,
      setting,
      successMsg,
      showDialog: !this.state.showDialog
    });
  };

  render() {
    const { ErrorHandler, t, setValue, lang, isEmailOK, ReactGA } = this.props;
    const { showDialog, title, msg, btnText, setting, successMsg } = this.state;
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
    }
    return (
      <ErrorHandler.ErrorBoundary>
        <div className="content mtop">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">{t("acctsetting")}</span>
            </div>
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

                    this.setDialogContent({
                      title,
                      msg,
                      btnText,
                      setting,
                      successMsg
                    });
                  }}
                >
                  Update Email
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="verification-box">
                <ChangePhoneBtn
                  t={t}
                  ErrorHandler={ErrorHandler}
                  lang={lang}
                  ReactGA={ReactGA}
                />
              </div>
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
                    this.setDialogContent({
                      title,
                      msg,
                      btnText,
                      setting,
                      successMsg
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
                  Change Gender
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
              setValue={value => setValue({ name: setting, value })}
              specialType={setting}
            />
          )}
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default AcctSettings;
