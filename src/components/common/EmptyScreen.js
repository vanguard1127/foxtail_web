import React from "react";

const EmptyScreen = ({ message }) => (
  <div
    style={{
      display: "flex",
      flex: "1",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    {message}
  </div>
);
export default EmptyScreen;
