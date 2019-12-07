import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import { Spring } from "react-spring/renderprops";
import ResetPasswordBtn from "./ResetPasswordBtn";
import EmailPasswordResetBtn from "./EmailPasswordResetBtn";
import Select from "./Select";
import { countryCodeOptions } from "../../../docs/options";
import * as yup from "yup";

class ResetPassword extends PureComponent {
  state = {
    text: "",
    code: "+1",
    email: "",
    password: "",
    confirmpass: "",
    isValid: true,
    errors: {}
  };

  schema = yup.object().shape({
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
  componentWillUnmount() {
    this.mounted = false;
  }

  setValue = ({ name, value, validate }) => {
    if (this.mounted) {
      this.setState({ [name]: value }, () => {
        validate && this.validateForm();
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

  render() {
    const {
      close,
      t,
      ErrorHandler,
      token,
      tReady,
      isLoggedIn,
      callback,
      ReactGA
    } = this.props;
    const {
      code,
      text,
      email,
      password,
      confirmpass,
      isValid,
      errors
    } = this.state;
    if (!tReady) {
      return null;
    }
    if (!token && !isLoggedIn) {
      return (
        <Spring
          from={{ opacity: 0.6 }}
          to={{ opacity: 1 }}
          after={{ test: "o" }}
        >
          {props => (
            <div className="popup-wrapper" style={props}>
              <section className="login-modal show">
                <div className="container">
                  <div className="offset-md-3 col-md-6">
                    <div className="popup">
                      <span className="head">{t("resetpass")}</span>
                      <a className="close" onClick={close} />
                      <form>
                        <div className="form-content">
                          <span className="description">{t("enterboth")}</span>
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
                                  name: "text",
                                  value: e.target.value.replace(/\D/g, "")
                                });
                              }}
                              value={text}
                              autoFocus
                            />
                          </div>
                          <div className="input password">
                            <input
                              type="email"
                              inputMode="email"
                              placeholder={"Email"}
                              value={email}
                              onChange={e => {
                                this.setValue({
                                  name: "email",
                                  value: e.target.value
                                });
                              }}
                            />
                          </div>

                          <div className="submit">
                            <ErrorHandler.ErrorBoundary>
                              <EmailPasswordResetBtn
                                t={t}
                                phone={code + text}
                                email={email}
                                close={close}
                                ErrorHandler={ErrorHandler}
                              />
                            </ErrorHandler.ErrorBoundary>
                            <button className="border" onClick={close}>
                              {t("common:Cancel")}
                            </button>
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
    return (
      <Spring from={{ opacity: 0.6 }} to={{ opacity: 1 }} after={{ test: "o" }}>
        {props => (
          <div className="popup-wrapper" style={props}>
            <section className="login-modal show">
              <div className="container">
                <div className="offset-md-3 col-md-6">
                  <div className="popup">
                    <span className="head">{t("setpass")}</span>
                    <a className="close" onClick={close} />
                    <form>
                      <div className="form-content">
                        <span className="description">{t("2faenabledes")}</span>

                        <div className="input password">
                          <input
                            type="password"
                            tabIndex="1"
                            placeholder={t("2faplaceholder")}
                            value={password}
                            onChange={e => {
                              this.setValue({
                                name: "password",
                                value: e.target.value,
                                validate: true
                              });
                            }}
                          />

                          {this.InputFeedback(t(errors.password))}
                        </div>

                        <div className="input password">
                          <input
                            type="Password"
                            tabIndex="2"
                            placeholder={"Confirm Password"}
                            onChange={e =>
                              this.setValue({
                                name: "confirmpass",
                                value: e.target.value,
                                validate: true
                              })
                            }
                            value={confirmpass}
                          />
                          {this.InputFeedback(t(errors.confirmpass))}
                        </div>

                        <div className="submit">
                          {isValid && (
                            <ErrorHandler.ErrorBoundary>
                              <ResetPasswordBtn
                                t={t}
                                token={token}
                                password={password}
                                close={close}
                                ErrorHandler={ErrorHandler}
                                callback={callback}
                                ReactGA={ReactGA}
                              />
                            </ErrorHandler.ErrorBoundary>
                          )}
                          <button className="border" onClick={close}>
                            {t("common:Cancel")}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>{" "}
          </div>
        )}
      </Spring>
    );
  }
}
export default withTranslation("modals")(ResetPassword);
