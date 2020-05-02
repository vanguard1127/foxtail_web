import React from "react";
import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";

import Logout from "./LogoutLink";

interface IMyAccountMenuProps extends RouteComponentProps {
  t: any;
  isCouple: boolean;
  isBlack: boolean
}

const MyAccountMenu: React.FC<IMyAccountMenuProps> = ({ history, location, t, isCouple, isBlack }) => {

  const onMenuClick = state => {
    history.push({
      state,
      pathname: "/settings"
    });
  };

  const onAddCouple = () => {
    onMenuClick({ showCplMdl: true });
  };

  const onShowBlackMember = () => {
    onMenuClick({ showBlkMdl: true });
  };

  return (
    <div className="toggle">
      <div className="dropdown hidden-mobile open">
        <ul>
          {location.pathname !== "/settings" && (
            <>
              <NavLink to="/settings">
                {isCouple ? (<li>{t("common:ouracct")}</li>) : (
                  <li>{t("common:myaccount")} </li>
                )}
              </NavLink>
              {!isCouple && (
                <li onClick={onAddCouple}>
                  <span role="heading" aria-level={2}>
                    {t("common:addcoup")}
                  </span>
                </li>
              )}
              {!isBlack && (
                <li className="border" onClick={onShowBlackMember}>
                  <span role="heading" aria-level={2}>
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

export default withRouter(MyAccountMenu);
