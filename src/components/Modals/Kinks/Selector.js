import React, { Component } from "react";
import { kinkOptions } from "../../../docs/options";

class Selector extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.kinks !== nextProps.kinks || this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const { togglePopup, kinks, t, ErrorBoundary, isEvent } = this.props;

    return (
      <span>
        <div className="select_kinks kinks_select_popup" onClick={togglePopup}>
          <span className="label">
            {!isEvent ? t("common:selkinks") : t("common:selplay")}:
          </span>
          <ErrorBoundary>
            <ul>
              {kinks.reduce(function(result, kink, idx) {
                const kinkObj = kinkOptions.find(el => el.value === kink);
                result.push(<li key={kink}>{t(kinkObj.label)}</li>);
                return result;
              }, [])}
            </ul>
            {kinks.length > 0 && (
              <span className="counter">{`(${kinks.length})`}</span>
            )}
          </ErrorBoundary>
        </div>
      </span>
    );
  }
}

export default Selector;
