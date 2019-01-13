import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const SliderWithToolTip = createSliderWithTooltip(Slider);

const DistanceSlider = ({ value, setValue, t }) => {
  return (
    <div className="item">
      <div className="range-head">{t("Distance")}:</div>
      <SliderWithToolTip
        onAfterChange={e => setValue(e)}
        min={0}
        max={100}
        defaultValue={value}
        tipFormatter={value => `${value}`}
        className="range-con"
      />
      <div className="limit">
        <span>&lt;1 {t("mil")}</span>
        <span>100+ {t("mil")}</span>
      </div>
    </div>
  );
};

export default DistanceSlider;
