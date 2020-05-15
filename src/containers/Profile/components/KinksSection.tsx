import React from "react";

import { kinkOptions } from "../../../docs/options";
import { WithT } from "i18next";

interface IKinksSectionProps extends WithT {
  kinks: any;
  ErrorBoundary: any;
}

const KinksSection: React.FC<IKinksSectionProps> = ({
  kinks,
  ErrorBoundary,
  t,
}) => {
  return (
    <ErrorBoundary>
      <div className="kinks">
        <div className="profile-head">{t("Kinks")}</div>
        <div className="list">
          <ul>
            {kinks.reduce(function (result, kink) {
              if (kinkOptions.find(el => el.value === kink)) {
                result.push(
                  <li key={kink}>
                    {t(kinkOptions.find(el => el.value === kink).label)}
                  </li>
                );
              }
              return result;
            }, [])}
          </ul>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default KinksSection;
