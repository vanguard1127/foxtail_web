import React, { Component } from "react";
class ProfileActions extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.liked !== nextProps.liked ||
      this.props.msgd !== nextProps.msgd
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      profile,
      setProfile,
      likeProfile,
      showMsgModal,
      t,
      liked,
      msgd
    } = this.props;

    return (
      <div className="functions">
        {!msgd ? (
          <>
            <div
              className="btn send-msg"
              onClick={async () => {
                await setProfile(profile);
                await showMsgModal();
              }}
            >
              {t("common:sendmsg")}
            </div>
            <div
              className={liked ? "btn heart unheart" : "btn heart"}
              onClick={async () => {
                await setProfile(profile);
                await likeProfile();
              }}
            />
          </>
        ) : (
          <div className="btn send-msg">Message Sent!</div>
        )}
      </div>
    );
  }
}

export default ProfileActions;
