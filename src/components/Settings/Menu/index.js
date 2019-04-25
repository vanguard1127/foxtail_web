import React, { Component } from "react";

class Menu extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.flashCpl !== nextProps.flashCpl ||
      this.props.couplePartner !== nextProps.couplePartner
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
      ErrorBoundary
    } = this.props;

    return (
      <ErrorBoundary>
        <div className="menu">
          <ul>
            <li className="active">
              <span>{t("common:myaccount")}</span>
            </li>
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
          </ul>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Menu;
