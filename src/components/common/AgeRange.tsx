import React from "react";
import Slider from "rc-slider";
import { WithT } from "i18next";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

interface IAgeRangeProps extends WithT {
  value: any,
  setValue: (val: any) => void,
  style?: any,
}

const AgeRange: React.FC<IAgeRangeProps> = ({
  value,
  setValue,
  style = {},
  t
}) => {
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
        style={style}
      />
      <div className="limit">
        <span>18 {t("common:years")}</span>
        <span>80+ {t("common:years")}</span>
      </div>
    </div>
  );
}

export default AgeRange;
