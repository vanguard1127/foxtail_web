import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const SliderWithToolTip = createSliderWithTooltip(Slider);
const milesToKilometers = miles => Math.floor(miles / 0.621371);

const DistanceSlider = ({ value, setValue, t, metric = "mi" }) => {
  return (
    <div className="item">
      <div className="range-head">{t("common:distance")}:</div>
      <SliderWithToolTip
        onAfterChange={e => setValue(e)}
        min={0}
        max={100}
        defaultValue={value}
        tipFormatter={value =>
          `${metric === "km" ? milesToKilometers(value) : value}`
        }
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
};

export default DistanceSlider;
