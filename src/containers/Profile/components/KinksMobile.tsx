import React from "react";
import { WithT } from "i18next";

import { kinkOptions } from "../../../docs/options";

interface IKinksMobileProps extends WithT {
  kinks: any;
  ErrorBoundary: any;
}

const KinksMobile: React.FC<IKinksMobileProps> = ({
  kinks,
  ErrorBoundary,
  t,
}) => (
    <ErrorBoundary>
      <div className="mobile kinks">
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

export default KinksMobile;
