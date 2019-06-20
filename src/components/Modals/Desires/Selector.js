import React, { Component } from "react";
import { desireOptions } from "../../../docs/options";
import { withTranslation } from "react-i18next";

class Selector extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.desires !== nextProps.desires) {
      return true;
    }
    return false;
  }
  render() {
    const { togglePopup, desires, t, ErrorBoundary } = this.props;
    console.log(t);
    return (
      <span>
        <div
          className="select_desires desires_select_popup"
          onClick={togglePopup}
        >
          <span className="label">{t("seldesires")}:</span>
          <ErrorBoundary>
            <ul>
              {desires.reduce(function(result, desire, idx) {
                const desireObj = desireOptions.find(el => el.value === desire);
                result.push(<li key={desire}>{t(desireObj.label)}</li>);
                return result;
              }, [])}
            </ul>
            {desires.length > 0 && (
              <span className="counter">{`(${desires.length})`}</span>
            )}
          </ErrorBoundary>
        </div>
      </span>
    );
  }
}

export default withTranslation("modals")(Selector);
