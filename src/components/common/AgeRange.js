import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const AgeRange = ({ value, setValue }) => {
  return (
    <div className="item">
      <div className="range-head">Age:</div>
      <Range
        onAfterChange={e => setValue(e)}
        min={18}
        max={80}
        defaultValue={value}
        tipFormatter={value => `${value}`}
        className="range-con"
      />
      <div class="limit">
        <span>18 years</span>
        <span>80+ years</span>
      </div>
    </div>
  );
};

export default AgeRange;
