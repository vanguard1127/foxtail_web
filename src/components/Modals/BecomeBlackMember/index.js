import React, { PureComponent } from "react";
import Modal from "../../common/Modal";
import BecomeBlackMemberImage from "../../../assets/img/elements/become-black-member.png";

class BecomeBlackMember extends PureComponent {
  render() {
    return (
      <Modal close={() => {}} fullWidth className="couples" noBorder>
        <div className="upgrade" style={{ backgroundImage: `url(${BecomeBlackMemberImage})` }}>
          <div className="backgound-opacity"></div>
          <div className="upgrade-content">
            <div className="top-content">
              <h3 className="title-large">become a black member</h3>
              <hr />
            </div>
            <h4 className="title-small">BLACK Member privledges include:</h4>
            <ul className="list-left">
              <li>
                <i className="fas fa-angle-right"></i> Direct Chat to Users (no match needed)
              </li>
              <li>
                <i className="fas fa-angle-right"></i> Change Location of your profile
              </li>
              <li>
                <i className="fas fa-angle-right"></i> Only Be Seen By Members You Like
              </li>
            </ul>
            <ul className="list-right">
              <li>
                <i className="fas fa-angle-right"></i> Hide your online status
              </li>
              <li>
                <i className="fas fa-angle-right"></i> Show highter in reults
              </li>
              <li>
                <i className="fas fa-angle-right"></i> Infinite Photos!
              </li>
            </ul>
            <p className="get-more">
              Get more of what you love <i className="fas fa-heart" style={{ color: "#db0016" }}></i>
            </p>
            <a href="" className="btn-link">
              <div className="btn-upgrade">
                <h5 className="text-gradient">Upgrade to Black Membership</h5>
              </div>
            </a>
          </div>
        </div>
      </Modal>
    );
  }
}

export default BecomeBlackMember;
