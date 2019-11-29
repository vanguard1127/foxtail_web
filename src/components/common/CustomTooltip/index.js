import React from "react";
import "./CustomTooltip.css";

const CustomTooltip = ({ placement, title, children, style }) => {
  return (
    <div className={`customtooltip`}>
      {placement === "left-start" && <div>{children}</div>}
      <div className={`tooltiptext ${`tooltiptext-${placement}`}`}>{title}</div>
      {placement !== "left-start" && <div>{children}</div>}
    </div>
  );
};

export default CustomTooltip;
