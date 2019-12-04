import React, { Component } from "react";
import { kinkOptions } from "../../docs/options";

class KinksMobile extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }

  render() {
    const { kinks, t, ErrorBoundary } = this.props;

    return (
      <ErrorBoundary>
        <div className="mobile kinks">
          <div className="profile-head">{t("Kinks")}</div>
          <div className="list">
            <ul>
              {kinks.reduce(function(result, kink) {
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
}

export default KinksMobile;
