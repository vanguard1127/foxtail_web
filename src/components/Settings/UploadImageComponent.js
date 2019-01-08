import React, { Component } from "react";
import Upload from "rc-upload";
import "./UploadImageComponentStyle.css";
import Icon from "@material-ui/core/Icon";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import ViewIcon from "@material-ui/icons/RemoveRedEye";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import PhotoModal from "../common/PhotoModal";

import { Modal } from "antd";

const styles = theme => ({
  addIcon: {
    fontSize: 45
  },
  progress: {
    "margin-top": "25px"
  }
});

class UploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedImagesFile: [],
      uploadedImagesURL: [],
      open: false,
      imgIndx: "", //for modal dialog
      loader: "inline-block",
      uploadImg: "none",
      totalImagesUploaded: 0,
      validateDisplay: "none",
      editorVisible: false,
      previewVisible: false,
      previewImage: "",
      fileList: [],
      fileToLoad: null,
      filename: "",
      filetype: "",
      file: null,
      order: "0",
      photoUrl: "",
      photoID: null
    };
  }

  error = (err, response, file) => {
    // console.log('file',file)
    var fileName = file.name;

    let idxDot = fileName.lastIndexOf(".") + 1;
    let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (
      extFile == "jpg" ||
      extFile == "jpeg" ||
      extFile == "png" ||
      extFile == "bmp" ||
      extFile == "gif"
    ) {
      //TO DO
      //  console.log('pics',this.state.totalImagesUploaded)

      if (this.state.totalImagesUploaded < this.props.max) {
        let preUplodedFile = this.state.uploadedImagesFile;
        let preUplodedURL = this.state.uploadedImagesURL;
        let imagesUploaded = this.state.totalImagesUploaded;
        let fileURL = URL.createObjectURL(file);
        preUplodedURL.push(fileURL);
        preUplodedFile.push(file);
        this.setState({
          uploadedImagesFile: preUplodedFile,
          uploadedImagesURL: preUplodedURL
        });
        this.increaseCount();
        this.props.recieveImgs(this.state.uploadedImagesFile);
      } else {
        this.setState({
          validateDisplay: "block"
        });
      }
    } else {
      alert("Only jpg/jpeg and png files are allowed!");
    }
  };
  deleteFile = index => {
    let filearray = this.state.uploadedImagesFile;
    let URLarray = this.state.uploadedImagesURL;
    filearray.splice(index, 1);
    URLarray.splice(index, 1);
    // console.log('pics',this.state.totalImagesUploaded)
    this.setState({
      uploadedImagesFile: filearray,
      uploadedImagesURL: URLarray
    });
    this.setState({
      totalImagesUploaded: this.state.totalImagesUploaded - 1
    });
    this.props.recieveImgs(this.state.uploadedImagesFile);
    // console.log('pics',this.state.totalImagesUploaded)
  };
  //modal
  handleClickOpen = index => {
    let imgURL = this.state.uploadedImagesURL[index];
    this.setState({
      imgIndx: imgURL,
      open: true
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  switchLoader = () => {
    this.setState({
      loader: "none",
      uploadImg: "block"
    });
  };
  increaseCount = () => {
    this.setState({
      totalImagesUploaded: this.state.totalImagesUploaded + 1
    });
  };

  handleShowImage() {
    this.setState({
      file: null,
      editorVisible: true
    });
  }

  render() {
    const { classes } = this.props;
    const {
      filename,
      filetype,
      editorVisible,
      previewVisible,
      previewImage,
      fileList,
      file
    } = this.state;
    const { handlePhotoListChange, showEditor } = this.props;

    return (
      <div className="header-container">
        {this.state.uploadedImagesURL.map((value, index) => {
          return (
            <div key={index + 100}>
              <div className="loader">
                <CircularProgress
                  style={{ display: this.state.loader }}
                  className={classes.progress}
                />
              </div>
              <div
                className="imgContainer"
                style={{ display: this.state.uploadImg }}
              >
                <img
                  className="img-box"
                  src={value}
                  onLoad={() => {
                    setTimeout(this.switchLoader, 1000);
                  }}
                />
                <div className="btns">
                  <DeleteIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.deleteFile(index);
                    }}
                  />
                  <ViewIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.handleClickOpen(index);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className="box">
          <Upload
            data={() => showEditor()}
            onSuccess={this.imageUploaded}
            onError={this.error}
            accept=".jpg,.jpeg,.png,.bmp,.gif"
          >
            <div className="upload-box">
              <AddIcon className={classes.addIcon} />
              <p className="text">Upload</p>
            </div>
          </Upload>
          <p
            style={{ display: this.state.validateDisplay }}
            className="validat"
          >
            You can only select {this.props.max} pics.
          </p>
        </div>

        <Dialog
          onClose={this.handleClose}
          aria-labelledby="Image"
          open={this.state.open}
        >
          <img src={this.state.imgIndx} />
        </Dialog>
        <PhotoModal
          previewVisible={previewVisible}
          previewImage={previewImage}
          handleCancel={() => this.handleCancel(false)}
        />
      </div>
    );
  }
}

UploadComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadComponent);
