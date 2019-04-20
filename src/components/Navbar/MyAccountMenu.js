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
            <li>
              {isCouple ? (
                <NavLink to="/settings">Our Account</NavLink>
              ) : (
                <NavLink to="/settings">{t("common:myaccount")}</NavLink>
              )}
            </li>
            {this.props.location.pathname !== "/settings" && (
              <>
                {!isCouple && (
                  <li>
                    <span
                      role="heading"
                      aria-level="2"
                      onClick={this.onAddCouple}
                    >
                      {t("common:addcoup")}
                    </span>
                  </li>
                )}

                {!isBlack && (
                  <li className="border">
                    <span
                      role="heading"
                      aria-level="2"
                      onClick={this.onShowBlackMember}
                    >
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
