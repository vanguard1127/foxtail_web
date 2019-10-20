import React, { Component } from "react";
import EditCanvasImage from "./ImageEditorWindow/EditCanvasImage";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";

class ImageEditor extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  render() {
    const {
      close,
      handlePhotoListChange,
      setS3PhotoParams,
      uploadToS3,
      signS3,
      t,
      ErrorHandler,
      imgUrl,
      setProfilePic,
      tReady
    } = this.props;
    if (!tReady) {
      return null;
    }

    const editCanvas = (
      <ErrorHandler.ErrorBoundary>
        <EditCanvasImage
          imgUrl={imgUrl}
          setS3PhotoParams={setS3PhotoParams}
          uploadToS3={uploadToS3}
          signS3={signS3}
          handlePhotoListChange={handlePhotoListChange}
          close={close}
          t={t}
          ErrorHandler={ErrorHandler}
          setProfilePic={setProfilePic}
        />
      </ErrorHandler.ErrorBoundary>
    );
    return (
      <div>
        <Modal
          fullScreen
          header={t("editphoto")}
          close={close}
          ref={el => (this.container = el)}
          popupClass={"photo-editor"}
          noFade
          showLoader
        >
          {editCanvas}
        </Modal>
      </div>
    );
  }
}
export default withTranslation("modals")(ImageEditor);
