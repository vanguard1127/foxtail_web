import React, { Component } from "react";
import * as ErrorHandler from "../common/ErrorHandler";
import LanguageControl from "../common/LanguageControl/LanguageControl";
import LoginButton from "../Landing/LoginButton";
import "./header.css";

class Header extends Component {
  render() {
    const {
      t,
      history,
      lang,
      reactga,
      toast,
      toggleResetPhone,
      toggleResetPass
    } = this.props;
    return (
      <header className={this.props.headerClasses.join(" ")}>
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-4">
                <div className="logo">
                  <span />
                </div>
                <span className="subtitle">{t("common:stray")}</span>
              </div>
              <div className="offset-md-3 col-md-5">
                <div className="content">
                  <span className="mobilesubtitle">{t("common:stray")}</span>

                  <span className="login">
                    <ErrorHandler.ErrorBoundary>
                      <LoginButton
                        t={t}
                        history={history}
                        ErrorHandler={ErrorHandler}
                        lang={lang}
                        reactga={reactga}
                        toast={toast}
                        toggleResetPhone={toggleResetPhone}
                        toggleResetPass={toggleResetPass}
                      />
                    </ErrorHandler.ErrorBoundary>
                  </span>
                  <ErrorHandler.ErrorBoundary>
                    <LanguageControl lang={lang} />
                  </ErrorHandler.ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
