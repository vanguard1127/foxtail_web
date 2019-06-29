import React, { Component } from "react";

class DesiresMobile extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
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
                <li key={Math.random()} className="capitalize">
                  {t(desire)}
                </li>
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
