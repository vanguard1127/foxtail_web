import React, { PureComponent } from "react";
import Avatar from "react-avatar";
import Modal from "../common/Modal";
import defaultPro from "../../assets/img/elements/defaultPro.png";

class ProfilePic extends PureComponent {
  state = {
    modalOpen: false
  };
  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };
  render() {
    const {
      profilePic,
      ErrorBoundary,
      history,
      id,
      removeProfilePic,
      t
    } = this.props;

    return (
      <ErrorBoundary>
        <div className="profile-picture-content">
          <div className="picture">
            <Avatar
              size="90"
              src={profilePic !== "" ? profilePic : defaultPro}
              round
              onClick={() => history.push("/member/" + id)}
            />
            {profilePic && (
              <div className="deleteProfile" onClick={this.toggleModal}>
                {t("common:remove")}
              </div>
            )}
          </div>
        </div>
        {this.state.modalOpen && (
          <Modal
            header={"Removing your profile pic?"}
            close={this.toggleModal}
            description={
              "*Tip: Clicking the bottom of your profile pic will remove it. Clicking the top will take you to your profile."
            }
            className="report"
            okSpan={
              <span
                onClick={() => {
                  removeProfilePic();
                  this.toggleModal();
                }}
                className={"color"}
              >
                {t("common:remove")}
              </span>
            }
          />
        )}
      </ErrorBoundary>
    );
  }
}

export default ProfilePic;
