/* eslint no-console:0 */

import React from "react";
import ReactDOM from "react-dom";
import Upload from "rc-upload";
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const props = {
  multiple: true,
  onStart(file) {
    console.log("onStart", file, file.name);
  },
  onSuccess(ret) {
    console.log("onSuccess", ret);
  },
  onError(err) {
    console.log("onError", err);
  },
  beforeUpload(file, fileList) {
    console.log(file, fileList);
    return new Promise(resolve => {
      console.log("start check");
      setTimeout(() => {
        console.log("check finshed");
        resolve(file);
      }, 3000);
    });
  }
};

const UploadPic = () => {
  return (
    <div
      style={{
        margin: 100
      }}
    >
      <div>
        <Upload {...props} customRequest={dummyRequest}>
          <a>开始上传</a>
        </Upload>
      </div>
    </div>
  );
};

export default UploadPic;
