import React from "react";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";

const RulesModal = ({ t, close }) => {
  return (
    <Modal
      header={t("Quick Rules Review")}
      close={close}
      className="rules"
      okSpan={
        <span className="color" onClick={close}>
          {t("I understand")}
        </span>
      }
      description={
        <div className="rulesCon">
          <p>{t("footer:weexpect")} </p>
          <div className="rulesScroll">
            <div>
              <h2>{t("footer:lgRules")}:</h2>
              <ul>
                <li>
                  {" "}
                  {t("Will get you banned and reported to law enforcement")}:
                  <ul>
                    <li>
                      {t("Sex for hire activity (including companionship)")}
                    </li>
                    <li>{t("Anything involving sexual acts with minors")}</li>
                    <li>
                      {t(
                        "Anything that is illegal in your juristdion. It is your responsioility to abide by your local laws."
                      )}
                    </li>
                  </ul>
                </li>
              </ul>
              <ul>
                <li>
                  {t(
                    "Will get your account flagged. *Flags make your profile show lower in results. Once you get 3 flags, your account is suspended."
                  )}
                  <ul>
                    {" "}
                    <li>
                      {t(
                        "Harassing members (including rude remarks, stalking, shaming, insulting, accusing, and more...)"
                      )}
                    </li>
                    <li>
                      {t(
                        "Using automated means (bots) to manipulate or store information on Foxtail"
                      )}
                    </li>
                    <li>
                      {t(
                        "Taking any data from Foxtail and sharing or storing elsewhere"
                      )}
                    </li>
                    <li>{t("Spamming and promtion")}</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="btm-msg">
              {t("Please follow all of our rules.")}
              <br />
              <span className="saying">{t("Stay Sexy, Stay Safe")}</span>
            </div>
            <div className="btm-sitename">Foxtail.</div>
          </div>
        </div>
      }
    />
  );
};

export default withTranslation("modals")(RulesModal);
