import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import * as yup from "yup";
import ConfirmPhoneButton from "./ConfirmPhoneButton";
import Select from "./Select";
import { countryCodeOptions } from "../../../docs/options";
import CircularProgress from "@material-ui/core/CircularProgress";

class ConfirmPhone extends PureComponent {
  state = {
    phoneNumber: "",
    code: "+1",
    vcode: "",
    sending: false,
    confirm: false,
    errors: {},
    password: "",
    confirmpass: "",
    isValid: true
  };

  //TODO: set this name rigth
  schema = yup.object().shape({
    password: yup
      .string()
      .matches(/^.[a-zA-Z0-9_]+$/, {
        message: "Alphanumeric characters or underscores only",
        excludeEmptyString: true
      })
      .max(30, "usernameLen"),
    confirmpass: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
  });

  componentDidMount() {
    this.mounted = true;
  }

  setValue = ({ name, value }) => {
    if (this.mounted) {
      this.setState({ [name]: value }, () => {
        this.validateForm();
      });
    }
  };

  validateForm = async () => {
    try {
      if (this.mounted) {
        const { password, confirmpass } = this.state;
        await this.schema.validate({ password, confirmpass });
        this.setState({ isValid: true, errors: {} });
        return true;
      }
    } catch (e) {
      let errors = { [e.path]: e.message };
      this.setState({ isValid: false, errors });
      return false;
    }
  };

  InputFeedback = error =>
    error ? (
      <div
        className="input-feedback"
        style={{
          float: "none",
          clear: "both",
          position: "relative",
          color: "red"
        }}
      >
        {error}
      </div>
    ) : null;

  renderPhoneInput() {
    const {
      close,
      t,
      ErrorHandler,
      token,
      history,
      lang,
      tReady,
      sendConfirmationMessage
    } = this.props;
    const {
      code,
      phoneNumber,
      password,
      confirmpass,
      isValid,
      errors
    } = this.state;

    return (
      <>
        <span className="description">{t("enterphone")}</span>
        <Select
          onChange={e => {
            this.setValue({
              name: "code",
              value: e.value
            });
          }}
          defaultOptionValue={code}
          options={countryCodeOptions}
          className={"dropdown"}
        />
        <div className="phoneText input">
          <input
            type="tel"
            placeholder={t("phonenum")}
            onChange={e => {
              this.setValue({
                name: "phoneNumber",
                value: e.target.value.replace(/\D/g, "")
              });
            }}
            value={phoneNumber}
            autoFocus
          />
        </div>
        {this.InputFeedback(t(errors.phoneNumber))}
        <span className="description">{t("enable2fa")}</span>
        <div className="input password">
          <input
            type="Password"
            placeholder={"Password"}
            onChange={e => {
              this.setValue({
                name: "password",
                value: e.target.value
              });
            }}
            value={password}
          />
          {this.InputFeedback(t(errors.password))}
        </div>
        <div className="input password">
          <input
            type="Password"
            placeholder={"Confirm Password"}
            onChange={e =>
              this.setValue({
                name: "confirmpass",
                value: e.target.value
              })
            }
            value={confirmpass}
          />
          {this.InputFeedback(t(errors.confirmpass))}
        </div>
        <div className="submit">
          <ErrorHandler.ErrorBoundary>
            <span
              className={!isValid ? "disabled" : "color"}
              onClick={() => {
                if (!isValid) {
                  return;
                }
                this.setState({
                  sending: true,
                  error: false,
                  confirm: false
                });
                sendConfirmationMessage(code + phoneNumber)
                  .then(() => {
                    this.setState({
                      sending: false,
                      error: false,
                      confirm: true
                    });
                  })
                  .catch(err => {
                    this.setState({
                      sending: false,
                      errors: { phoneNumber: err.message }
                    });
                  });
              }}
            >
              {t("sendvcode")}
            </span>
          </ErrorHandler.ErrorBoundary>
          <button className="border" onClick={() => close()}>
            Cancel
          </button>
        </div>
      </>
    );
  }

  renderLogin() {
    const {
      close,
      t,
      ErrorHandler,
      token,
      history,
      lang,
      tReady,
      sendConfirmationMessage
    } = this.props;
    const {
      code,
      phoneNumber,
      password,
      confirmpass,
      isValid,
      errors
    } = this.state;

    return (
      <>
        <span className="description">{t("enterphone")}</span>
        <Select
          onChange={e => {
            this.setValue({
              name: "code",
              value: e.value
            });
          }}
          defaultOptionValue={code}
          options={countryCodeOptions}
          className={"dropdown"}
        />
        <div className="phoneText input">
          <input
            type="tel"
            placeholder={t("phonenum")}
            onChange={e => {
              this.setValue({
                name: "phoneNumber",
                value: e.target.value.replace(/\D/g, "")
              });
            }}
            value={phoneNumber}
            autoFocus
          />
        </div>
        {this.InputFeedback(t(errors.phoneNumber))}
        <div className="input password">
          <input
            type="Password"
            placeholder={"Password (if you have one)"}
            onChange={e => {
              this.setValue({
                name: "password",
                value: e.target.value
              });
            }}
            value={password}
          />
          {this.InputFeedback(t(errors.password))}
        </div>
        <div className="submit">
          <ErrorHandler.ErrorBoundary>
            <span
              className="color"
              onClick={() => {
                this.setState({
                  sending: true,
                  error: false,
                  confirm: false
                });
                sendConfirmationMessage(code + phoneNumber)
                  .then(() => {
                    this.setState({
                      sending: false,
                      error: false,
                      confirm: true
                    });
                  })
                  .catch(err => {
                    this.setState({
                      sending: false,
                      errors: { phoneNumber: err.message }
                    });
                  });
              }}
            >
              {t("sendvcode")}
            </span>
          </ErrorHandler.ErrorBoundary>
          <button className="border" onClick={() => close()}>
            Cancel
          </button>
        </div>
      </>
    );
  }

  renderLoading() {
    return (
      <div style={{ textAlign: "center" }}>
        <CircularProgress />{" "}
      </div>
    );
  }

  renderCodeInput() {
    const {
      close,
      t,
      ErrorHandler,
      token,
      history,
      lang,
      tReady,
      confirmPhone,
      onSuccess
    } = this.props;
    const { vcode, password } = this.state;
    return (
      <>
        <span className="description">{t("entercode")}</span>
        <div className="input">
          <input
            type="text"
            placeholder={t("vcode")}
            onChange={e => {
              this.setValue({
                name: "vcode",
                value: e.target.value
              });
            }}
            value={vcode}
            autoFocus
          />
          {this.state.error ? (
            <div className="input-feedback">{this.state.error}</div>
          ) : (
            ""
          )}
        </div>
        <div className="submit">
          <ErrorHandler.ErrorBoundary>
            <span
              className="color"
              onClick={() => {
                this.setState({
                  sending: true,
                  error: false,
                  confirm: true
                });
                confirmPhone(vcode)
                  .then(result => {
                    this.setState(
                      {
                        sending: false,
                        error: false,
                        confirm: true
                      },
                      () => {
                        onSuccess(result, password);
                      }
                    );
                  })
                  .catch(err => {
                    this.setState({
                      sending: false,
                      error: err.message
                    });
                  });
              }}
            >
              {t("confirmphone")}
            </span>
          </ErrorHandler.ErrorBoundary>
          <button className="border" onClick={() => close()}>
            Cancel
          </button>
        </div>
      </>
    );
  }

  render() {
    const {
      close,
      t,
      ErrorHandler,
      token,
      history,
      lang,
      tReady,
      sendConfirmationMessage,
      type
    } = this.props;

    if (!tReady) {
      return null;
    }
    let body;
    if (this.state.confirm) {
      body = this.renderCodeInput();
    } else {
      if (type === "signup") {
        body = this.renderPhoneInput();
      } else {
        body = this.renderLogin();
      }
    }
    if (!token) {
      return (
        <section className="login-modal show confirm-phone">
          <div className="container">
            <div className="offset-md-3 col-md-6">
              <div className="popup">
                <span className="head">{t("confirmphone")}</span>
                <a className="close" onClick={() => close()} />
                <div className="form">
                  <div className="form-content">
                    {this.state.sending ? (
                      this.renderLoading()
                    ) : (
                      <div>{body}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return (
      <section className="login-modal show">
        <div className="container">
          <div className="offset-md-3 col-md-6">
            <div className="popup">
              <span className="head">{t("updphone")}</span>
              <a className="close" onClick={() => close()} />
              <form className="form">
                <div className="form-content">
                  <div className="submit">
                    <ErrorHandler.ErrorBoundary>
                      <ConfirmPhoneButton
                        token={token}
                        t={t}
                        history={history}
                        ErrorHandler={ErrorHandler}
                        lang={lang}
                        sendConfirmationMessage={sendConfirmationMessage}
                      />
                    </ErrorHandler.ErrorBoundary>
                    <button className="border" onClick={() => close()}>
                      {t("common:Cancel")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default withTranslation("modals")(ConfirmPhone);
