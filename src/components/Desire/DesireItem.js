import React from "react";

const DesireItem = ({ desire, onClick }) => (
  <div style={style} onClick={onClick}>
    {desire}
  </div>
);

const style = {
  borderRadius: 5,
  border: "1px blue solid",
  width: "auto"
};
export default DesireItem;
