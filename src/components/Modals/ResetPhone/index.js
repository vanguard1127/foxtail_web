import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import { Spring } from "react-spring/renderprops";
import EmailPhoneResetBtn from "./EmailPhoneResetBtn";
import ResetPhoneButton from "./ResetPhoneButton";
import Select from "./Select";
import { countryCodeOptions } from "../../../docs/options";

class ResetPhone extends PureComponent {
  state = { text: "", code: "+1" };
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
    const { code, text } = this.state;
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
                      <a className="close" onClick={() => close()} />
                      <form className="form">
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
                          </div>

                          <div className="submit">
                            <ErrorHandler.ErrorBoundary>
                              <EmailPhoneResetBtn
                                t={t}
                                phone={code + text}
                                close={close}
                                ErrorHandler={ErrorHandler}
                              />
                            </ErrorHandler.ErrorBoundary>
                            <button className="border" onClick={() => close()}>
                              Cancel
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
    return (
      <Spring from={{ opacity: 0.6 }} to={{ opacity: 1 }} after={{ test: "o" }}>
        {props => (
          <div className="popup-wrapper" style={props}>
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
                            <ResetPhoneButton
                              token={token}
                              t={t}
                              history={history}
                              ErrorHandler={ErrorHandler}
                              lang={lang}
                              ReactGA={ReactGA}
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
            </section>{" "}
          </div>
        )}
      </Spring>
    );
  }
}
export default withTranslation("modals")(ResetPhone);
