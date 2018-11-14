import React from "react";
import { Modal } from "antd";
const PhotoModal = ({ previewVisible, previewImage, handleCancel }) => {
  return (
    <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
      <img alt="upload" style={{ width: "100%" }} src={previewImage} />
    </Modal>
  );
};
export default PhotoModal;
