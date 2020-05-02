import React from "react";
const DistanceMetricSwitch = ({ distanceMetric, setValue, t }) => {
  return (
    <div className="switch-con border-top">
      <div className="sw-head">{t("dmetric")}:</div>
      <div className="sw-btn">
        <div className="switch distance">
          <input
            type="checkbox"
            id="distance"
            checked={distanceMetric === "mi" ? true : false}
            onChange={e => {
              setValue({
                name: "distanceMetric",
                value: distanceMetric === "km" ? "mi" : "km",
                doRefetch: true
              });
            }}
          />
          <label htmlFor="distance" />
        </div>
      </div>
    </div>
  );
};

export default DistanceMetricSwitch;
