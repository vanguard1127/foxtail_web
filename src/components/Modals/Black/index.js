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
                    <span className="heading">{t("black")}</span>
                    <span className="title">{t("getmore")}</span>
                    <span className="close" onClick={close} />
                  </div>
                  <img
                    alt="upload"
                    style={{ width: "100%" }}
                    src={require("../../../images/girl2.jpg")}
                  />
                  <div>
                    <h3>{t("blkinclude")}:</h3>
                    <ul>
                      <li>{t("direct")}</li>
                      <li>{t("changeloc")}</li>
                      <li>{t("onlyliked")}</li>
                      <li>{t("hidestat")}</li>
                      <li>{t("higher") + "!"}</li>
                      <li>{t("phoneblock")}</li>
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
