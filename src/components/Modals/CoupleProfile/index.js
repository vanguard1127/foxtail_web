import React, { PureComponent } from "react";
import Modal from "../../common/Modal";
import CoupleProfileImage from "../../../assets/img/elements/couple-profile.png";

class CoupleProfile extends PureComponent {
  render() {
    return (
      <Modal close={() => {}} fullWidth className="couples" noBorder>
        <div className="couple-profile">
          <div className="profile-top">
            <h3 className="title">Couple profile</h3>
            <h4 className="title-small">stay together</h4>
          </div>
          <div className="profile-bottom">
            <div className="layer-left">
              <img src={CoupleProfileImage} alt="" />
              <p className="content">
                Couple Profile's are profiles shared by 2 people.
                <br />
                All communications are accessible by both members.
              </p>
            </div>
            <div className="layer-right">
              <h4 className="question-first">Did you recieve Couple's Code?</h4>
              <p className="require">Add your Couple's Code here and click Submit!</p>
              <form action="/action_page.php">
                <input type="text" name="addYourCouple" value="" />
                <input type="submit" value="Submit" />
              </form>
              <hr className="line" />
              <h4 className="question-second">Want to create a Couple Profile?</h4>
              <p className="require-code">Send this Couple's Code to your pantner</p>
              <div className="Couple-code">
                <div className="content-code">dlndDqiB</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CoupleProfile;
