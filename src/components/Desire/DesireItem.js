import React from "react";

const DesireItem = ({ desire, onClick, style }) => (
  <div style={style} onClick={onClick}>
    {desire}
  </div>
);

export default DesireItem;
