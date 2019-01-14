import React, { Component } from "react";
import CreateSubBtn from "./CreateSubBtn";
import { withNamespaces } from "react-i18next";

class Black extends Component {
  state = { token: "", ccLast4: "" };

  render() {
    const { close, t } = this.props;
    return (
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup photo-verification">
                  <div className="m-head">
                    <span className="heading">{t("Black Membership")}</span>
                    <span className="title">{t("Get more")}</span>
                    <span className="close" onClick={close} />
                  </div>
                  <img
                    alt="upload"
                    style={{ width: "100%" }}
                    src={require("../../../images/girl2.jpg")}
                  />
                  <div>
                    <h3>{t("BLACK Member privledges include")}:</h3>
                    <ul>
                      <li>{t("Direct Chat to Users (no match needed)")}</li>
                      <li>{t("Change Location of your profile")}</li>
                      <li>{t("Only Be Seen By Members You Like")}</li>
                      <li>{t("Hide your online and read status")}</li>
                      <li>
                        {t("Exclusive Black members by only search filter")}
                      </li>
                      <li>{t("Show higher in results")}</li>
                      <li>
                        {t(
                          "Block current and future members by phone number and email (Invisible from people you know)"
                        )}
                      </li>
                    </ul>
                  </div>
                  <CreateSubBtn
                    // refetchUser={this.props.refetchUser}
                    close={close}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default withNamespaces()(Black);
