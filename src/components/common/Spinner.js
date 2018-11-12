import React from "react";
import { Spin } from "antd";

const Spinner = ({ message, size }) => (
  <div
    style={{
      display: "flex",
      flex: "1",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <Spin size={size} tip={message || "Loading..."} />
  </div>
);

export default Spinner;
