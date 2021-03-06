import React from "react";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import "./BecomeBlackMember.css";
import BecomeBlackMemberImage from "../../../assets/img/elements/become-black-member.jpg";

const BecomeBlackMember = ({
  close,
  t,
  ErrorHandler,
  lang,
  tReady,
  toggleCCModal
}) => {
  return (
    <Modal close={close} fullWidth className="black" noHeader>
      <div
        className="upgrade"
        style={{ backgroundImage: `url(${BecomeBlackMemberImage})` }}
      >
        <div className="upgrade-content">
          <div className="top-content">
            <div className="vanish-scroll" style={{ backgroundColor: "#fff" }}>
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
              {t("unlimlikes")}
            </li>
          </ul>
          <p className="get-more">
            {t("getmore")}
            <i className="fas fa-heart" style={{ color: "#db0016" }}></i>
          </p>
          <span href="" className="btn-link" onClick={toggleCCModal}>
            <div className="btn-upgrade">
              <span className="text-gradient">{t("upgradeblk")}</span>
            </div>
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default withTranslation("modals")(BecomeBlackMember);
