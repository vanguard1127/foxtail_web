import React, { Component } from "react";
import EditCanvasImage from "./ImageEditorWindow/EditCanvasImage";
import { withNamespaces } from "react-i18next";
import Modal from "../../common/Modal";
class ImageEditor extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const {
      close,
      file,
      handlePhotoListChange,
      setS3PhotoParams,
      uploadToS3,
      signS3,
      t,
      ErrorHandler
    } = this.props;

    return (
      <Modal fullWidth={true} header={t("editphoto")} close={close}>
        <ErrorHandler.ErrorBoundary>
          <EditCanvasImage
            imageObject={file}
            setS3PhotoParams={setS3PhotoParams}
            uploadToS3={uploadToS3}
            signS3={signS3}
            handlePhotoListChange={handlePhotoListChange}
            close={close}
            t={t}
            ErrorHandler={ErrorHandler}
          />
        </ErrorHandler.ErrorBoundary>
      </Modal>
    );
  }
}
export default withNamespaces("modals")(ImageEditor);
