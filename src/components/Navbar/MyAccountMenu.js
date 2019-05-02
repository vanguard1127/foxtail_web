import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import Logout from "./LogoutLink";

class MyAccountMenu extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  onMenuClick = state => {
    this.props.history.push({
      state,
      pathname: "/settings"
    });
  };

  onAddCouple = () => {
    this.onMenuClick({ showCplMdl: true });
  };

  onShowBlackMember = () => {
    this.onMenuClick({ showBlkMdl: true });
  };

  render() {
    const { t, isCouple, isBlack } = this.props;
    return (
      <div className="toggle">
        <div className="dropdown hidden-mobile open">
          <ul>
            {isCouple ? (
              <NavLink to="/settings">
                {" "}
                <li>{t("ouracct")}</li>
              </NavLink>
            ) : (
              <NavLink to="/settings">
                {" "}
                <li>{t("common:myaccount")} </li>
              </NavLink>
            )}

            {this.props.location.pathname !== "/settings" && (
              <>
                {!isCouple && (
                  <li onClick={this.onAddCouple}>
                    <span role="heading" aria-level="2">
                      {t("common:addcoup")}
                    </span>
                  </li>
                )}

                {!isBlack && (
                  <li className="border" onClick={this.onShowBlackMember}>
                    <span role="heading" aria-level="2">
                      {t("common:becomeblk")}
                    </span>
                  </li>
                )}
              </>
            )}
            <li>
              <Logout t={t} />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(MyAccountMenu);
