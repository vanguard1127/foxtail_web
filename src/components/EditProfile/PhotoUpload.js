import React, { Component } from "react";
import UploadButton from "./UploadButton";

class PhotoUpload extends Component {
  state = {};

  render() {
    return (
      <div style={{ backgroundColor: "#eee", height: "20vh" }}>
        <div style={{ backgroundColor: "#666", width: "20vh", height: "15vh" }}>
          <img alt="pic" />
        </div>
        <div style={{ width: "20vh", height: "5vh" }}>
          <UploadButton />
        </div>
      </div>
    );
  }
}

export default PhotoUpload;
