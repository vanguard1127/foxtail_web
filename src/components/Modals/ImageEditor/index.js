import React, { Component } from "react";
import EditCanvasImage from "components/EditProfile/EditCanvasImage";

export default class ImageEditor extends Component {
  state = { photos: [], filename: "", filetype: "", photoKey: "" };
  setPhotos = photos => {
    this.setState({ photos });
  };

  render() {
    const {
      close,
      file,
      handlePhotoListChange,
      setS3PhotoParams,
      uploadToS3,
      signS3
    } = this.props;

    return (
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup">
                  <div className="m-head">
                    <span className="heading">Edit Photo</span>
                    <span className="close" onClick={close} />
                  </div>
                  <div className="m-body">
                    <EditCanvasImage
                      imageObject={file}
                      setS3PhotoParams={setS3PhotoParams}
                      uploadToS3={uploadToS3}
                      signS3={signS3}
                      handlePhotoListChange={handlePhotoListChange}
                      close={close}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
