import React, { Component } from "react";
import EditCanvasImage from "./ImageEditorWindow/EditCanvasImage";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import { Spring } from "react-spring/renderprops";

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
      file,
      handleUpload,
      signS3,
      t,
      ErrorHandler,
      tReady
    } = this.props;
    if (!tReady) {
      return null;
    }
    const editor = (
      <Spring from={{ opacity: 0.6 }} to={{ opacity: 1 }}>
        {props => (
          <div style={props}>
            <ErrorHandler.ErrorBoundary>
              <EditCanvasImage
                imageObject={file}
                handleUpload={handleUpload}
                signS3={signS3}
                close={close}
                t={t}
                ErrorHandler={ErrorHandler}
              />
            </ErrorHandler.ErrorBoundary>
          </div>
        )}
      </Spring>
    );
    return (
      <Modal
        fullScreen
        header={t("editphoto")}
        close={close}
        ref={el => (this.container = el)}
        className="edit-photo-modal clearfix"
        noFade
        showLoader
      >
        {editor}
      </Modal>
    );
  }
}
export default withTranslation("modals")(ImageEditor);
