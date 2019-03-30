import React, { Component } from "react";
import _ from "lodash";

class DesiresMobile extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { desires, t, ErrorBoundary } = this.props;

    return (
      <ErrorBoundary>
        <div className="mobile desires">
          <div className="profile-head">{t("Desires")}</div>
          <ul>
            {desires.reduce(function(result, desire) {
              result.push(
                <li key={Math.random()}>{_.capitalize(t(desire))}</li>
              );
              return result;
            }, [])}
          </ul>
        </div>
      </ErrorBoundary>
    );
  }
}

export default DesiresMobile;
