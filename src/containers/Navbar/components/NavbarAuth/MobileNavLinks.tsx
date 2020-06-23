import React from "react";
import { Link, Prompt } from "react-router-dom";

import Logout from "../LogoutLink";

interface IMobileNavLinksProps {
  mobileMenu: boolean;
  openInbox: () => void;
  toggleMobileMenu: () => void;
  messagesCount: number;
  isCouple: boolean;
  isBlack: boolean;
  history: any;
  t: any;
}

const MobileNavLinks: React.FC<IMobileNavLinksProps> = ({
  mobileMenu,
  openInbox,
  toggleMobileMenu,
  messagesCount,
  isCouple,
  isBlack,
  history,
  t
}) => {
  return (
    <div
      className={mobileMenu === true ? "mobile-toggle show" : "mobile-toggle"}
    >
      <ul>
        <li>
          <Link to="/members">{t("meetmembers")}</Link>
        </li>
        <li>
          <Link to="/events">{t("goevents")}</Link>
        </li>
        <li>
          <Link to="/party">{t("chat")}</Link>
        </li>
        <li>
          <span onClick={openInbox}>
            <div className="inbox">
              {t("common:Inbox")}
              {messagesCount > 0 && (
                <span className="count">{messagesCount}</span>
              )}
            </div>
          </span>
        </li>
        <li>
          <Link to="/settings">
            {isCouple ? t("common:ouracct") : t("common:myaccount")}
          </Link>
        </li>
        {history.location.pathname !== "/settings" && (
          <React.Fragment>
            {!isCouple && (
              <li>
                <span
                  onClick={() => {
                    history.push({
                      pathname: "/settings",
                      state: { showCplMdl: true }
                    });
                  }}
                >
                  {t("common:addcoup")}
                </span>
              </li>
            )}
            {!isBlack && (
              <li>
                <span
                  onClick={() => {
                    history.push({
                      pathname: "/settings",
                      state: { showBlkMdl: true }
                    });
                  }}
                  className="highlightTxt"
                >
                  {t("common:becomeblk")}
                </span>
              </li>
            )}
          </React.Fragment>
        )}
        <li>
          <span>
            <Logout t={t} />
          </span>
        </li>
      </ul>
      <Prompt
        message={(_, actionType) => {
          toggleMobileMenu();
          if (actionType === "POP") {
            return false;
          } else {
            return true;
          }
        }}
        when={mobileMenu}
      />
    </div>
  );
};

export default MobileNavLinks;
