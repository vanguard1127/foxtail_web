import React from "react";

const ClickableItem = ({ text, onClick, style, value, className }) => (
  <div style={style} onClick={onClick} value={value} className={className}>
    {text}
  </div>
);

export default ClickableItem;
