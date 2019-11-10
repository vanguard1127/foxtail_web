import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import ResetPasswordBtn from "./ResetPasswordBtn";
import EmailPasswordResetBtn from "./EmailPasswordResetBtn";
import Select from "./Select";
import { countryCodeOptions } from "../../../docs/options";

class ResetPassword extends PureComponent {
  state = { text: "", code: "+1", email: "", password: "" };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  handleChange = e => {
    if (this.mounted) {
      this.setState({ code: e.value });
    }
  };

  render() {
    const { close, t, ErrorHandler, token, history, lang, tReady } = this.props;
    const { code, text, email, password } = this.state;
    if (!tReady) {
      return null;
    }
    if (!token) {
      return (
        <section className="login-modal show">
          <div className="container">
            <div className="offset-md-3 col-md-6">
              <div className="popup">
                <span className="head">{t("resetpass")}</span>
                <a className="close" onClick={() => close()} />
                <form className="form">
                  <div className="form-content">
                    <span className="description">{t("enterboth")}</span>
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
              <span className="head">{t("resetpass")}</span>
              <a className="close" onClick={() => close()} />
              <form className="form">
                <div className="form-content">
                  <span className="description">
                    {t("common:2faenabledes")}
                  </span>

                  <div className="input password">
                    <input
                      type="password"
                      placeholder={t("common:2faplaceholder")}
                      value={password}
                      onChange={e => {
                        this.setValue({
                          name: "password",
                          value: e.target.value
                        });
                      }}
                    />
                  </div>

                  <div className="submit">
                    <ErrorHandler.ErrorBoundary>
                      <ResetPasswordBtn
                        t={t}
                        token={token}
                        password={password}
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
}
export default withTranslation("modals")(ResetPassword);
