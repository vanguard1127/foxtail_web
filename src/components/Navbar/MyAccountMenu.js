import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import Logout from "./LogoutLink";

class MyAccountMenu extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  onMenuClick = state => {
    const { history } = this.props;
    history.push({
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
    const { t, history } = this.props;
    return (
      <div className="toggle">
        <div className="dropdown hidden-mobile open">
          <ul>
            <li>
              <NavLink to="/settings">{t("common:myaccount")}</NavLink>
            </li>
            <li>
              <span role="heading" aria-level="2" onClick={this.onAddCouple}>
                {t("common:addcoup")}
              </span>
            </li>
            <li className="border">
              <span
                role="heading"
                aria-level="2"
                onClick={this.onShowBlackMember}
              >
                {t("common:becomeblk")}
              </span>
            </li>
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
