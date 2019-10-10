import React, { Component } from "react";
import { desireOptions } from "../../../docs/options";

class Selector extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.desires !== nextProps.desires || this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const { togglePopup, desires, t, ErrorBoundary } = this.props;

    return (
      <span>
        <div className="select_desires desires_select_popup" onClick={togglePopup}>
          <span className="label">{t("common:seldesires")}:</span>
          <ErrorBoundary>
            <ul>
              {desires.reduce(function(result, desire, idx) {
                const desireObj = desireOptions.find(el => el.value === desire);
                result.push(<li key={desire}>{t(desireObj.label)}</li>);
                return result;
              }, [])}
            </ul>
            {desires.length > 0 && <span className="counter">{`(${desires.length})`}</span>}
          </ErrorBoundary>
        </div>
      </span>
    );
  }
}

export default Selector;
