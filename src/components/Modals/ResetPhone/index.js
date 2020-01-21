import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import { Spring } from "react-spring/renderprops";
import * as yup from "yup";
import EmailPhoneResetBtn from "./EmailPhoneResetBtn";
import ResetPhoneButton from "./ResetPhoneButton";
import Select from "./Select";
import { countryCodeOptions } from "../../../docs/options";
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

class ResetPhone extends PureComponent {
  state = { text: "", code: "+1", isValid: false, errors: {} };

  schema = yup.object().shape({
    phoneNumber: yup.string().matches(phoneRegExp, "Phone number is not valid")
  });

  componentDidMount() {
    this.mounted = true;
  }
  handleTextChange = event => {
    if (this.mounted) {
      this.setState({ text: event.target.value.replace(/\D/g, "") });
    }
  };

  handleChange = e => {
    if (this.mounted) {
      this.setState({ code: e.value });
    }
  };

  validatePhone = async () => {
    try {
      if (this.mounted) {
        const { code, text } = this.state;
        const phoneStr = code + text;
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
  render() {
    const {
      close,
      t,
      ErrorHandler,
      token,
      history,
      lang,
      tReady,
      ReactGA
    } = this.props;
    const { code, text, errors } = this.state;
    if (!tReady) {
      return null;
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
              <section className="login-modal show">
                <div className="container">
                  <div className="offset-md-3 col-md-6">
                    <div className="popup">
                      <span className="head">{t("resetphone")}</span>
                      <a className="close" onClick={close} />
                      <form>
                        <div className="form-content">
                          <span className="description">{t("enterlast")}</span>
                          <Select
                            onChange={this.handleChange}
                            defaultOptionValue={code}
                            options={countryCodeOptions}
                            className={"dropdown"}
                          />

                          <div className="phoneText input">
                            <input
                              type="tel"
                              placeholder={t("phonenum")}
                              onChange={this.handleTextChange}
                              value={text}
                              autoFocus
                            />
                            {this.InputFeedback(t(errors.phoneNumber))}
                          </div>

                          <div className="submit">
                            <ErrorHandler.ErrorBoundary>
                              <EmailPhoneResetBtn
                                t={t}
                                phone={code + text}
                                close={close}
                                ErrorHandler={ErrorHandler}
                                validatePhone={this.validatePhone}
                              />
                            </ErrorHandler.ErrorBoundary>
                            <button className="border" onClick={close}>
                              {t("Cancel")}
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
                    <div
                      id="recaptcha-container"
                      style={{ display: "none" }}
                    ></div>
                    <span className="head">{t("common:updphone")}</span>
                    <a className="close" onClick={close} />
                    <form>
                      <div className="form-content">
                        <div className="submit">
                          <ErrorHandler.ErrorBoundary>
                            <ResetPhoneButton
                              token={token}
                              t={t}
                              history={history}
                              ErrorHandler={ErrorHandler}
                              lang={lang}
                              ReactGA={ReactGA}
                              close={close}
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
}
export default withTranslation("modals")(ResetPhone);
