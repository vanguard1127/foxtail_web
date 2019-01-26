import React from "react";
import ProgressiveImage from "react-progressive-image";

const Ad = ({ ad: { message, img, tinyImg, btnText } }) => (
  <div
    style={{
      display: "flex",
      flex: "1",
      alignItems: "center",
      justifyContent: "center",
      width: "auto",
      height: "100vh",
      borderRadius: "5px"
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "60%",
        height: "60vh",
        marginTop: "10vh",
        flexDirection: "column",
        alignSelf: "flex-start"
      }}
    >
      <div
        style={{
          display: "flex",
          flex: "2",
          justifyContent: "center",
          backgroundColor: "white",
          alignItems: "center"
        }}
      >
        <ProgressiveImage src={img} placeholder={tinyImg}>
          {src => <img src={src} alt="" width="100%" height="100%" />}
        </ProgressiveImage>
      </div>
      <div
        style={{
          display: "flex",
          flex: "1",
          justifyContent: "space-around",
          backgroundColor: "white",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <div>
          {" "}
          <h3>{message}</h3>
        </div>
        <div>
          <button style={{ minWidth: "100px" }}>{btnText}</button>
        </div>
      </div>
    </div>
  </div>
);
export default Ad;
