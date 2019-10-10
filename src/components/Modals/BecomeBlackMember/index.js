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
      <Modal
        close={this.props.close}
        fullWidth
        className="black"
        noBorder
        noHeader
      >
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
              <h3 className="title-large">become a black member</h3>
              <hr />
            </div>
            <h4 className="title-small">BLACK Member privledges include:</h4>
            <ul className="list-left">
              <li>
                <i className="fas fa-angle-right"></i> Direct Chat to Users (no
                match needed)
              </li>
              <li>
                <i className="fas fa-angle-right"></i> Change Location of your
                profile
              </li>
              <li>
                <i className="fas fa-angle-right"></i> Only Be Seen By Members
                You Like
              </li>
              <li>
                <i className="fas fa-angle-right"></i> Exclusive icon next to
                your chats and comments.
              </li>
            </ul>
            <ul className="list-right">
              <li>
                <i className="fas fa-angle-right"></i> Hide your online status
              </li>
              <li>
                <i className="fas fa-angle-right"></i> Show higher in results
              </li>
              <li>
                <i className="fas fa-angle-right"></i> Infinite Photos
              </li>
              <li>
                <i className="fas fa-angle-right"></i> More coming soon!
              </li>
            </ul>
            <p className="get-more">
              Get more of what you love{" "}
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
