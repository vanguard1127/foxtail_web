import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import CreateSubBtn from "./CreateSubBtn";
import "./BecomeBlackMember.css";
import BecomeBlackMemberImage from "../../../assets/img/elements/become-black-member.png";

class BecomeBlackMember extends PureComponent {
  render() {
    const { close, t, ErrorHandler, notifyClient, lang, tReady } = this.props;
    if (!tReady) {
      return null;
    }
    return (
      <Modal close={this.props.close} fullWidth className="black" noHeader>
        <div
          className="upgrade"
          style={{ backgroundImage: `url(${BecomeBlackMemberImage})` }}
        >
          <div className="backgound-opacity"></div>
          <div className="upgrade-content">
            <div className="top-content">
              <div
                className="vanish-scroll"
                style={{ backgroundColor: "#fff" }}
              >
                {t("scroll")}
              </div>
              <h3 className="title-large">{t("common:become")}</h3>
              <hr />
            </div>
            <h4 className="title-small">{t("blkinclude")}</h4>
            <ul className="list-left">
              <li>
                <i className="fas fa-angle-right"></i>
                {t("direct")}
              </li>
              <li>
                <i className="fas fa-angle-right"></i>
                {t("changeloc")}
              </li>
              <li>
                <i className="fas fa-angle-right"></i>
                {t("onlyliked")}
              </li>
              <li>
                <i className="fas fa-angle-right"></i>
                {t("excicon")}
              </li>
            </ul>
            <ul className="list-right">
              <li>
                <i className="fas fa-angle-right"></i>
                {t("hidestat")}
              </li>
              <li>
                <i className="fas fa-angle-right"></i>
                {t("higher")}
              </li>
              <li>
                <i className="fas fa-angle-right"></i>
                {t("infinite")}
              </li>
              <li>
                <i className="fas fa-angle-right"></i>
                {t("morecoming")}
              </li>
            </ul>
            <p className="get-more">
              {t("getmore")}{" "}
              <i className="fas fa-heart" style={{ color: "#db0016" }}></i>
            </p>
            <CreateSubBtn
              close={close}
              t={t}
              ErrorHandler={ErrorHandler}
              notifyClient={notifyClient}
              lang={lang}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default withTranslation("modals")(BecomeBlackMember);
