import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogModal from "../../Modals/Dialog";
import Button from "@material-ui/core/Button";
import RequestEmailVerBtn from "./RequestEmailVerBtn";
import ChangePhoneBtn from "./ChangePhoneBtn";
import ResetPassModal from "../../Modals/ResetPassword";
import * as yup from "yup";
import { Mutation } from "react-apollo";
import { RESET_PASSWORD } from "../../../queries";
class AcctSettings extends Component {
  state = {
    showDialog: false,
    msg: "",
    btnText: "",
    title: "",
    setting: "",
    successMsg: "",
    placeholder: "",
    resetPassVisible: false,
    clearPassDlg: false
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

  toggleClearPassDlg = () => {
    this.setState({ clearPassDlg: !this.state.clearPassDlg });
  };

  handleDlgBtnClick = resetPassword => {
    resetPassword()
      .then(({ data }) => {
        this.setState({ clearPassDlg: false });
        this.props.setValue({ name: "password", value: null });
        this.props.refetchUser();
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  render() {
    const {
      ErrorHandler,
      t,
      setValue,
      lang,
      isEmailOK,
      ReactGA,
      passEnabled,
      refetchUser
    } = this.props;

    const {
      showDialog,
      title,
      msg,
      btnText,
      setting,
      successMsg,
      placeholder,
      resetPassVisible,
      clearPassDlg
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
                      onChange={() => {
                        if (!passEnabled) {
                          this.setState({
                            resetPassVisible: !resetPassVisible
                          });
                        } else {
                          this.toggleClearPassDlg();
                        }
                        refetchUser();
                      }}
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
            <DialogModal
              close={this.toggleDialog}
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
          <Dialog onClose={this.toggleClearPassDlg} open={clearPassDlg}>
            <DialogTitle id="alert-dialog-title">{t("removepass")}</DialogTitle>

            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("removepassdes")}
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Mutation
                mutation={RESET_PASSWORD}
                variables={{
                  password: ""
                }}
              >
                {resetPassword => (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        this.handleDlgBtnClick(resetPassword);
                      }}
                    >
                      {"Remove Password"}
                    </Button>
                    {"  "}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        this.setState({ clearPassDlg: false });
                      }}
                    >
                      {t("common:Cancel")}
                    </Button>
                  </>
                )}
              </Mutation>
            </DialogActions>
          </Dialog>
          {resetPassVisible && (
            <ResetPassModal
              t={t}
              close={() => {
                this.setState({ resetPassVisible: false });
                this.props.setValue({ name: "password", value: "" });
                this.props.refetchUser();
              }}
              ErrorHandler={ErrorHandler}
              isLoggedIn={true}
              callback={() =>
                setValue({
                  name: "password",
                  value: ""
                })
              }
            />
          )}
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default AcctSettings;
