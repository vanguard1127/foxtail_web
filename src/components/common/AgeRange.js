import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const AgeRange = ({ value, setValue, t }) => {
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
      />
      <div className="limit">
        <span>18 {t("common:years")}</span>
        <span>80+ {t("common:years")}</span>
      </div>
    </div>
  );
};

export default AgeRange;
