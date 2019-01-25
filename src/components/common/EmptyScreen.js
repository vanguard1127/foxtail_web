import React from "react";

const EmptyScreen = ({ message }) => (
  <div
    style={{
      display: "flex",
      flex: "1",
      alignItems: "center",
      justifyContent: "center",
      float: "left",
      width: "100%"
    }}
  >
    {message}
  </div>
);
export default EmptyScreen;
