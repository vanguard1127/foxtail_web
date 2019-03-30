import React, { Component } from "react";
import { desireOptions } from "../../docs/options";
class DesiresSection extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { desires, t, ErrorBoundary } = this.props;
    return (
      <ErrorBoundary>
        <div className="desires">
          <div className="profile-head">{t("Desires")}</div>
          <ul>
            {desires.reduce(function(result, desire) {
              if (desireOptions.find(el => el.value === desire)) {
                result.push(
                  <li key={desire}>
                    {t(desireOptions.find(el => el.value === desire).label)}
                  </li>
                );
              }
              return result;
            }, [])}
          </ul>
        </div>
      </ErrorBoundary>
    );
  }
}

export default DesiresSection;
