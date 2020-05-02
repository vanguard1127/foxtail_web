import React, { Component } from "react";

class Menu extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.flashCpl !== nextProps.flashCpl ||
      this.props.couplePartner !== nextProps.couplePartner ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      coupleModalToggle,
      couplePartner,
      blackModalToggle,
      t,
      flashCpl,
      currentuser,
      ErrorBoundary,
      shareModalToggle
    } = this.props;

    let cplItemStyle = "";
    if (flashCpl) {
      cplItemStyle += "flashCpl ";
    }
    if (couplePartner === null) {
      cplItemStyle += "coupleIcon";
    } else {
      cplItemStyle += "coupleRemIcon ";
    }

    return (
      <ErrorBoundary>
        <div className="menu">
          <ul>
            <li>
              <span onClick={coupleModalToggle} className={cplItemStyle}>
                {couplePartner === null
                  ? t("common:addcoup")
                  : t("common:Partner") + ": " + couplePartner}
              </span>
            </li>
            <li className="highlightTxt">
              {currentuser.blackMember.active ? (
                <span style={{ cursor: "default" }}>{t("common:thanks")}.</span>
              ) : (
                <span onClick={blackModalToggle}>
                  {t("common:becomeblk")}
                  <span className="blkIcon"></span>
                </span>
              )}
            </li>
            <li
              className="active"
              title={t(
                "Get a free week of Black Membership when someone using your link joins Foxtail."
              )}
            >
              <span onClick={() => shareModalToggle(false)}>
                {t("common:sharefox")} ({t("common:+1 week")}{" "}
                <span className="blkIcon"></span>)
              </span>
            </li>
            <li
              title={t(
                "Get a free week of Black Membership when someone using your link joins Foxtail."
              )}
            >
              <span onClick={() => shareModalToggle(true)}>
                {t("common:shareme")}
              </span>
            </li>
          </ul>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Menu;
