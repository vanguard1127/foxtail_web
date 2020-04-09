import React, { Component } from "react";
import { Prompt } from "react-router-dom";
import ProfilePic from "./ProfilePic";
import ProfileActions from "./ProfileActions";
import DailyLimitModal from "../../Modals/DailyLimit";
import DirectMsgModal from "../../Modals/DirectMsg";
class ProfileCard extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.liked !== nextState.liked ||
      this.state.msgModalVisible !== nextState.msgModalVisible ||
      this.props.msgd !== nextProps.msgd ||
      this.state.maxLikeDlgVisible !== nextState.maxLikeDlgVisible
    ) {
      return true;
    }
    return false;
  }

  state = {
    liked: this.props.liked,
    msgModalVisible: false,
    maxLikeDlgVisible: false
  };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  setMaxLikeDlgVisible = () => {
    this.props.ErrorHandler.setBreadcrumb("Max Like Dialog Toggled:");
    if (this.mounted) {
      this.setState({ maxLikeDlgVisible: !this.state.maxLikeDlgVisible });
    }
  };

  toggleLiked = () => {
    if (
      !this.state.liked &&
      this.props.likesSent > 24 &&
      !this.props.isBlackMember
    ) {
      this.setMaxLikeDlgVisible();
      return;
    }
    this.setState({ liked: !this.state.liked }, () => this.props.likeProfile());
  };

  setMsgModalVisible = msgModalVisible => {
    const { toast, ErrorHandler, isBlackMember, t } = this.props;
    ErrorHandler.setBreadcrumb("Message Modal Opened:" + msgModalVisible);
    if (this.props.msgsSent > 4 && msgModalVisible) {
      if (!toast.isActive("maxmsgs")) {
        toast.info(
          t(
            "common:Daily Direct Message Limit Reached. *Only 5 allowed daily."
          ),
          {
            position: toast.POSITION.TOP_CENTER,
            toastId: "maxmsgs"
          }
        );
      }
      return;
    }
    if (!isBlackMember) {
      if (!toast.isActive("directerr")) {
        toast.info(
          <div
            onClick={() =>
              this.props.history.push({
                state: { showBlkMdl: true },
                pathname: "/settings"
              })
            }
          >
            {this.props.t("common:directerr")}
          </div>,
          {
            position: toast.POSITION.TOP_CENTER,
            toastId: "directerr"
          }
        );
      }
      return;
    }
    if (this.mounted) {
      this.setState({ msgModalVisible });
    }
  };

  setMessaged = profileID => {
    this.props.ErrorHandler.setBreadcrumb("Messaged:" + profileID);
    if (this.mounted) {
      this.props.setMsgSent();
      this.setState({ msgModalVisible: false });
    }
  };

  render() {
    const {
      profile,
      t,
      ErrorHandler,
      isSelf,
      ReactGA,
      msgd,
      history,
      showShareModal,
      handlePreview
    } = this.props;
    const { profilePic, id, users } = profile;

    const { liked, msgModalVisible, maxLikeDlgVisible } = this.state;

    let badge = "";
    if (
      users.every(
        user =>
          user.verifications.photoVer.active && user.verifications.stdVer.active
      )
    ) {
      badge = "full-verified";
    } else if (users.every(user => user.verifications.stdVer.active)) {
      badge = "std-verified";
    } else if (users.every(user => user.verifications.photoVer.active)) {
      badge = "profile-verified";
    }

    return (
      <ErrorHandler.ErrorBoundary>
        <div
          className={
            isSelf || msgd ? "avatar-content no-btns" : "avatar-content"
          }
        >
          <div className={"avatar-card " + badge}>
            <ProfilePic profilePic={profilePic} handlePreview={handlePreview} />
            {!isSelf ? (
              <ProfileActions
                profileID={id}
                likeProfile={this.toggleLiked}
                showMsgModal={() => this.setMsgModalVisible(true)}
                t={t}
                liked={liked}
                msgd={msgd}
              />
            ) : (
              <div className="functions">
                <div className="btn share" onClick={showShareModal}>
                  {t("common:shareme")}
                </div>
              </div>
            )}
          </div>
        </div>
        {profile && msgModalVisible && (
          <DirectMsgModal
            profile={profile}
            close={() => this.setMsgModalVisible(false)}
            ErrorHandler={ErrorHandler}
            setMsgd={() => this.setMessaged(id)}
            ReactGA={ReactGA}
          />
        )}
        {maxLikeDlgVisible && (
          <DailyLimitModal
            close={this.setMaxLikeDlgVisible}
            t={t}
            history={history}
          />
        )}
        <Prompt
          message={(location, actionType) => {
            if (actionType === "POP") {
              history.goForward();
              this.setMsgModalVisible(false);
              return false;
            } else {
              return true;
            }
          }}
          when={msgModalVisible}
        />
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default ProfileCard;
