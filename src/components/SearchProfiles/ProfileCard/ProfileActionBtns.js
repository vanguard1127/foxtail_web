import React, { Component } from "react";

class ProfileActionBtns extends Component {
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
    const { profile, likeProfile, showMsgModal, liked, msgd, t } = this.props;

    return (
      <div className="function">
        {!msgd ? (
          <>
            <div
              className={liked ? "btn unheart" : "btn heart"}
              onClick={() => {
                likeProfile(profile);
              }}
            />

            <div
              className="btn message"
              onClick={() => {
                showMsgModal(profile);
              }}
            />
          </>
        ) : (
          <div className="btn sent">{t("common:msgsent")}</div>
        )}
      </div>
    );
  }
}

export default ProfileActionBtns;
