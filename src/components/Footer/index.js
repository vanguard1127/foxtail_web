import React, { Component } from "react";
import { Mutation } from "react-apollo";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton
} from "react-share";
import { SEEN_TOUR } from "../../queries";

import { withNamespaces } from "react-i18next";

class Footer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  render() {
    const { t } = this.props;
    const shareUrl = "www.fotxtailapp.com";
    const title = "Foxtail";
    return (
      <footer>
        <div className="brand">
          <div className="container">
            <div className="col-md-12">
              <div className="logo">
                <span />
              </div>
              <div className="medias">
                <ul>
                  <li className="facebook">
                    <FacebookShareButton url={shareUrl} quote={title}>
                      <span aria-label="facebook share">
                        <i />
                      </span>
                    </FacebookShareButton>
                  </li>
                  <li className="twitter">
                    <TwitterShareButton url={shareUrl} title={title}>
                      <span aria-label="twitter share">
                        <i />
                      </span>
                    </TwitterShareButton>
                  </li>
                  <li className="mail">
                    <EmailShareButton url={shareUrl} title={title}>
                      <span aria-label="email share">
                        <i />
                      </span>
                    </EmailShareButton>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright">
          <div className="container">
            <div className="col-md-12">
              <span className="text">
                © 2019 - 2020 Foxtail App Inc. {t("register")}.
              </span>
              <div className="menu">
                <ul>
                  {process.env.NODE_ENV === "development" && (
                    <li>
                      <Mutation
                        mutation={SEEN_TOUR}
                        variables={{
                          tour: "reset"
                        }}
                      >
                        {seenTour => {
                          //TODO:REmove
                          return (
                            <span onClick={() => seenTour()}>Reset Tour</span>
                          );
                        }}
                      </Mutation>
                    </li>
                  )}
                  <li>
                    <span onClick={() => window.location.replace("/tos")}>
                      {t("termscon")}
                    </span>
                  </li>
                  <li>
                    <span onClick={() => window.location.replace("/privacy")}>
                      {t("privacy")}
                    </span>
                  </li>
                  <li>
                    <a href="mailto:support@foxtailapp.com">{t("contact")}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default withNamespaces("footer")(Footer);
