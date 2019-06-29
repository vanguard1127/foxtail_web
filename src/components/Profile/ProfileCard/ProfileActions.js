import React, { Component } from "react";
class ProfileActions extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.liked !== nextProps.liked ||
      this.props.msgd !== nextProps.msgd ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }
  render() {
    const { likeProfile, showMsgModal, t, liked, msgd } = this.props;

    return (
      <div className="functions">
        {!msgd ? (
          <>
            <div className="btn send-msg" onClick={showMsgModal}>
              {t("common:sendmsg")}
            </div>
            <div
              className={liked ? "btn heart unheart" : "btn heart"}
              onClick={likeProfile}
            />
          </>
        ) : (
          <div className="btn send-msg"> {t("common:msgsent")}</div>
        )}
      </div>
    );
  }
}

export default ProfileActions;
