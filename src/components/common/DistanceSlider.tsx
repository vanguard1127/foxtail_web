import React from "react";
import Slider from "rc-slider";
import { WithT } from "i18next";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const SliderWithToolTip = createSliderWithTooltip(Slider);

interface IDistanceSliderProps extends WithT {
  value: number | string,
  setValue?: any,
  metric?: string,
  style?: any,
}

const DistanceSlider: React.FC<IDistanceSliderProps> = ({
  value,
  setValue = null,
  metric = "mi",
  style = {},
  t,
}) => {
  const onAfterChange = e => {
    if (setValue) {
      setValue(e);
    }
  };

  return (
    <div className="item">
      <div className="range-head">{t("common:distance")}:</div>
      <SliderWithToolTip
        onAfterChange={onAfterChange}
        min={0}
        max={100}
        defaultValue={value}
        tipFormatter={distance => {
          if (metric === "km") {
            return Math.floor(distance / 0.621371);
          }
          return distance;
        }}
        className="range-con"
        style={style}
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
