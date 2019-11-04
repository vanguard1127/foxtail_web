import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import ConfirmPhoneButton from "./ConfirmPhoneButton";
import Select from "./Select";
import { countryCodeOptions } from "../../../docs/options";
import CircularProgress from "@material-ui/core/CircularProgress";

class ConfirmPhone extends PureComponent {
  state = {
    text: "",
    code: "+1",
    vcode: "",
    sending: false,
    confirm: false,
    error: false
  };
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

  handleCodeChange = e => {
    if (this.mounted) {
      this.setState({ vcode: e.target.value });
    }
  };

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
    const { code, text } = this.state;
    return (
      <>
        <span className="description">{t("enterphone")}</span>
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

        {this.state.error ? (
          <div
            className="input-feedback"
            style={{
              float: "none",
              clear: "both",
              position: "relative",
              top: "-10px"
            }}
          >
            {this.state.error}
          </div>
        ) : (
          ""
        )}

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
                sendConfirmationMessage(code + text)
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
                      error: err.message
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
    const { vcode } = this.state;
    return (
      <>
        <span className="description">{t("entercode")}</span>
        <div className="input">
          <input
            type="text"
            placeholder={t("vcode")}
            onChange={this.handleCodeChange}
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
                        onSuccess(result);
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
      sendConfirmationMessage
    } = this.props;
    const { code, text } = this.state;
    if (!tReady) {
      return null;
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
                      <div>
                        {this.state.confirm
                          ? this.renderCodeInput()
                          : this.renderPhoneInput()}
                      </div>
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
