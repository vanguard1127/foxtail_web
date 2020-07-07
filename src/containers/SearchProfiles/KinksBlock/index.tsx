import React from "react";
import { WithT } from "i18next";

import { Context } from "../SearchProfilesPage";

interface IKinksBlockProps extends WithT {
  kinks: any;
  id: string;
  onClick: () => void;
}

const KinksBlock: React.FC<IKinksBlockProps> = ({
  kinks,
  id,
  onClick,
  t,
}) => {
  return (
    <Context.Consumer>
      {({ kinkOptions }) => (
        <span className="interest" onClick={onClick}>
          <ul>
            {kinks.reduce(function (result, kink) {
              if (result.length < 2) {
                if (kinkOptions.find(el => el.value === kink)) {
                  const kinkLbl = t(
                    kinkOptions.find(el => el.value === kink).label
                  );
                  result.push(
                    <li key={kink} title={kinkLbl}>
                      {kinkLbl}
                    </li>
                  );
                  if (result.length > 1 && kinks.length > 2) {
                    result.push(<li key={"na" + id}>+{kinks.length - 2}</li>);
                  }
                }
              }
              return result;
            }, [])}
          </ul>
        </span>
      )}
    </Context.Consumer>
  );
}

export default KinksBlock;
