import React, { Component } from "react";
import EditCanvasImage from "./ImageEditorWindow/EditCanvasImage";
import { withNamespaces } from "react-i18next";
import Modal from "../../common/Modal";
import { Spring } from "react-spring/renderprops";

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
      <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
        {props => (
          <div style={props}>
            <Modal
              fullScreen
              header={t("editphoto")}
              close={close}
              ref={el => (this.container = el)}
            >
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
          </div>
        )}
      </Spring>
    );
  }
}
export default withNamespaces("modals")(ImageEditor);
