import React, { Component } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class AgeRange extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.value !== nextProps.value || this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const { value, setValue, t } = this.props;
    return (
      <div className="item">
        <div className="range-head">{t("common:Age")}:</div>
        <Range
          onAfterChange={e => setValue(e)}
          min={18}
          max={80}
          defaultValue={value}
          tipFormatter={value => `${value}`}
          className="range-con"
          style={this.props.style}
        />
        <div className="limit">
          <span>18 {t("common:years")}</span>
          <span>80+ {t("common:years")}</span>
        </div>
      </div>
    );
  }
}

export default AgeRange;
