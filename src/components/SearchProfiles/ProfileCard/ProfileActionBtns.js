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
    const {
      profile,
      likeProfile,
      showMsgModal,
      liked,
      msgd,
      t,
      featured
    } = this.props;

    let actions;
    if (liked && featured) {
      actions = <div className="btn sent">{t("common:matched")}</div>;
    } else if (!msgd) {
      actions = (
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
      );
    } else {
      actions = <div className="btn sent">{t("common:msgsent")}</div>;
    }
    return <div className="function">{actions}</div>;
  }
}

export default ProfileActionBtns;
