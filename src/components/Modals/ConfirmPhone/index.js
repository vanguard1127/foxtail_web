import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import * as yup from "yup";
import { Spring } from "react-spring/renderprops";
import Select from "./Select";
import { countryCodeOptions } from "../../../docs/options";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../../../assets/css/login-modal.css";

const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

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

  schema = yup.object().shape({
    phoneNumber: yup.string().matches(phoneRegExp, "Phone number is not valid"),
    password: yup
      .string()
      .matches(/^.[a-zA-Z0-9_]+$/, {
        message: this.props.t("Alphanumeric characters or underscores only"),
        excludeEmptyString: true
      })
      .max(30, this.props.t("Passwords must be less than 30 characters")),
    confirmpass: yup
      .string()
      .oneOf([yup.ref("password"), null], this.props.t("Passwords must match"))
  });

  componentDidMount() {
    this.mounted = true;
  }

  setValue = ({ name, value, onlyPass }) => {
    if (this.mounted) {
      this.setState({ [name]: value }, () => {
        if (name !== "phoneNumber") {
          this.validateForm(onlyPass);
        } else {
          this.validatePhone();
        }
      });
    }
  };

  validateForm = async onlyPass => {
    try {
      if (this.mounted) {
        const { password, confirmpass } = this.state;
        if (!onlyPass) {
          await this.schema.validate({ password, confirmpass });
        } else {
          await this.schema.validate({ password });
        }
      }

      this.setState({ isValid: true, errors: {} });
      return true;
    } catch (e) {
      let errors = { [e.path]: e.message };
      this.setState({ isValid: false, errors });
      return false;
    }
  };

  validatePhone = async () => {
    try {
      if (this.mounted) {
        const { code, phoneNumber } = this.state;
        const phoneStr = code + phoneNumber;
        await this.schema.validate({ phoneNumber: phoneStr });
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

  submitPhone = () => {
    const { sendConfirmationMessage, ErrorHandler } = this.props;
    const { code, phoneNumber, isValid } = this.state;
    ErrorHandler.setBreadcrumb("submit phone clicked");
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
  };

  verifyCode = () => {
    const { confirmPhone, onSuccess, ErrorHandler } = this.props;
    const { vcode, password } = this.state;
    ErrorHandler.setBreadcrumb("verify code clicked");
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
  };

  renderPhoneInput() {
    const { close, t, ErrorHandler, sendConfirmationMessage } = this.props;
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
          className={"dropdown phone"}
        />
        <div className="phoneText input">
          <input
            type="tel"
            tabIndex="1"
            placeholder={t("phonenum")}
            onChange={e => {
              this.setValue({
                name: "phoneNumber",
                value: e.target.value.replace(/\D/g, "")
              });
            }}
            value={phoneNumber}
            autoFocus
            required
          />
        </div>
        {this.InputFeedback(t(errors.phoneNumber))}
        <span className="description">{t("enable2fa")}</span>
        <div className="input password">
          <input
            type="password"
            tabIndex="2"
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
            type="password"
            tabIndex="3"
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
              tabIndex="4"
              onClick={() => {
                ErrorHandler.setBreadcrumb("send confirmation code");
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
          <span className="border" onClick={close}>
            {t("common:Cancel")}
          </span>
        </div>
      </>
    );
  }

  renderLogin() {
    const { close, t, ErrorHandler, noPass } = this.props;
    const { code, phoneNumber, password, errors } = this.state;

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
          className={"dropdown phone"}
        />
        <div className="phoneText input">
          <input
            type="tel"
            inputMode="tel"
            placeholder={t("phonenum")}
            onChange={e => {
              this.setValue({
                name: "phoneNumber",
                value: e.target.value.replace(/\D/g, "")
              });
            }}
            tabIndex="1"
            value={phoneNumber}
            autoFocus
            required
          />
        </div>
        {this.InputFeedback(t(errors.phoneNumber))}
        {!noPass && (
          <div className="input password">
            <input
              type="password"
              placeholder={"Password (if you have one)"}
              tabIndex="2"
              onChange={e => {
                this.setValue({
                  name: "password",
                  value: e.target.value,
                  onlyPass: true
                });
              }}
              value={password}
            />
            {this.InputFeedback(t(errors.password))}
          </div>
        )}
        <div className="submit">
          <ErrorHandler.ErrorBoundary>
            <button
              type="submit"
              tabIndex="3"
              className="color"
              onClick={this.submitPhone}
            >
              {t("sendvcode")}
            </button>
          </ErrorHandler.ErrorBoundary>
          <span className="border" onClick={close}>
            {t("common:Cancel")}
          </span>
        </div>
      </>
    );
  }

  renderLoading() {
    return (
      <div style={{ textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  renderCodeInput() {
    const { close, t } = this.props;
    const { vcode } = this.state;
    return (
      <>
        <span className="description">{t("entercode")}</span>
        <div className="input code">
          <input
            name="vcode"
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
            required
          />
          {this.state.error ? (
            <div className="input-feedback">{this.state.error}</div>
          ) : (
            ""
          )}
        </div>
        <div className="submit">
          <button type="submit" className="color" onClick={this.verifyCode}>
            {t("confirmphone")}
          </button>
          <span className="border" onClick={close}>
            {t("common:Cancel")}
          </span>
        </div>
      </>
    );
  }

  render() {
    const {
      close,
      t,
      token,
      tReady,
      sendConfirmationMessage,
      type,
      title
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
        <Spring
          from={{ opacity: 0.6 }}
          to={{ opacity: 1 }}
          after={{ test: "o" }}
        >
          {props => (
            <div className="popup-wrapper" style={props}>
              <section className="login-modal show confirm-phone">
                <div className="container">
                  <div className="offset-md-3 col-md-6">
                    <div className="popup">
                      <span className="head">{title}</span>
                      <a className="close" onClick={close} />
                      <form>
                        <div className="form-content">
                          {this.state.sending ? (
                            this.renderLoading()
                          ) : (
                            <div>{body}</div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </Spring>
      );
    }
    return (
      <Spring from={{ opacity: 0.6 }} to={{ opacity: 1 }} after={{ test: "o" }}>
        {props => (
          <div className="popup-wrapper" style={props}>
            <section className="login-modal show">
              <div className="container">
                <div className="offset-md-3 col-md-6">
                  <div className="popup">
                    <span className="head">{title}</span>
                    <a className="close" onClick={close} />
                    <form>
                      <div className="form-content">
                        <div className="submit">
                          <span
                            className="color"
                            onClick={sendConfirmationMessage}
                          >
                            {t("sendvcode")}
                          </span>
                          <span className="border" onClick={close}>
                            {t("common:Cancel")}
                          </span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </Spring>
    );
  }
}
export default withTranslation("modals")(ConfirmPhone);
