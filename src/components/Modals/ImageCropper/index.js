import React, { Component } from "react";
import EditCanvasImage from "./ImageEditorWindow/EditCanvasImage";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import { Spring } from "react-spring/renderprops";

class ImageEditor extends Component {
  shouldComponentUpdate() {
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
      setProfilePic
    } = this.props;

    return (
      <Spring from={{ opacity: 0.4 }} to={{ opacity: 1 }}>
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
            </Modal>
          </div>
        )}
      </Spring>
    );
  }
}
export default withTranslation("modals")(ImageEditor);