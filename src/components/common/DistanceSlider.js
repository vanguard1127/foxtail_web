import React, { Component } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import milesToKilometers from "../../utils/distanceMetric";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const SliderWithToolTip = createSliderWithTooltip(Slider);

class DistanceSlider extends Component {
  shouldComponentUpdate(nextProps) {
    const { value } = this.props;
    if (value !== nextProps.value) return true;
    return false;
  }

  onAfterChange = e => {
    const { setValue } = this.props;
    if (setValue) setValue(e);
  };

  render() {
    const { value, t, metric = "mi" } = this.props;

    return (
      <div className="item">
        <div className="range-head">{t("common:distance")}:</div>
        <SliderWithToolTip
          onAfterChange={this.onAfterChange}
          min={0}
          max={100}
          defaultValue={value}
          tipFormatter={distance => milesToKilometers(distance, metric)}
          className="range-con"
        />
        <div className="limit">
          <span>
            &lt; {metric === "km" ? "2 " : "1 "}
            {metric === "km" ? t("common:km") : t("common:mil")}
          </span>
          <span>
            {metric === "km" ? "160+ " : "100+ "}
            {metric === "km" ? t("common:km") : t("common:mil")}
          </span>
        </div>
      </div>
    );
  }
}

export default DistanceSlider;
