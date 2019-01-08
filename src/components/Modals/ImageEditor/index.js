import React, { Component } from "react";
import EditCanvasImage from "components/EditProfile/EditCanvasImage";

export default class ImageEditor extends Component {
  state = { photos: [], filename: "", filetype: "", photoKey: "" };
  setPhotos = photos => {
    this.setState({ photos });
  };

  render() {
    const { closePopup, file, fileList, handlePhotoListChange } = this.props;

    return (
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup">
                  <EditCanvasImage
                    imageObject={file}
                    setS3PhotoParams={this.setS3PhotoParams}
                    uploadToS3={this.uploadToS3}
                    fileList={fileList}
                    handlePhotoListChange={({ file, fileList }) =>
                      this.handleChange(
                        file,
                        fileList,
                        true,
                        handlePhotoListChange
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
