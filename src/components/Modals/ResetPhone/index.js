import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import EmailPhoneResetBtn from "./EmailPhoneResetBtn";
import ResetPhoneButton from "./ResetPhoneButton";
import Select from "./Select";
import Spinner from "../../common/Spinner";
import { countryCodeOptions } from "../../../docs/options";

class ResetPhone extends PureComponent {
  state = { text: "", code: "+1" };
  componentDidMount() {
    this.mounted = true;
    if (this.textInput) {
      this.textInput.focus();
    }
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
    const { close, t, ErrorHandler, token, history, lang, tReady } = this.props;
    const { code, text } = this.state;
    if (!tReady) {
      return (
        <section className="login-modal show">
          <div className="container">
            <div className="offset-md-3 col-md-6">
              <div className="popup">
                <a className="close" onClick={() => close()} />
                <Spinner />{" "}
              </div>
            </div>
          </div>
        </section>
      );
    }
    if (!token) {
      return (
        <section className="login-modal show">
          <div className="container">
            <div className="offset-md-3 col-md-6">
              <div className="popup">
                <span className="head">{t("resetphone")}</span>
                <a className="close" onClick={() => close()} />
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
                        ref={input => {
                          this.textInput = input;
                        }}
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
export default withTranslation("modals")(ResetPhone);
