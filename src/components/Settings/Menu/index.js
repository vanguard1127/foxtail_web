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

    return (
      <ErrorBoundary>
        <div className="menu">
          <ul>
            <li>
              <span
                onClick={() => coupleModalToggle()}
                className={flashCpl ? "flashCpl" : null}
              >
                {couplePartner === null
                  ? t("common:addcoup")
                  : "Partner: " + couplePartner}
              </span>
            </li>
            <li className="highlightTxt">
              {currentuser.blackMember.active ? (
                <span style={{ cursor: "auto" }}>{t("common:thanks")}.</span>
              ) : (
                <span onClick={blackModalToggle}>{t("common:becomeblk")}</span>
              )}
            </li>
            <li className="active">
              <span onClick={shareModalToggle}>{t("common:sharefox")}</span>
            </li>
          </ul>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Menu;
