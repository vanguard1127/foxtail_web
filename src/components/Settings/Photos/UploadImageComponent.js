import React, { PureComponent } from "react";
import Upload from "rc-upload";
import "./UploadImageComponentStyle.css";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import ViewIcon from "@material-ui/icons/RemoveRedEye";
import StarIcon from "@material-ui/icons/Grade";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Lightbox from "react-image-lightbox";
import resizeImage from "../../../utils/resizeImage";

const styles = theme => ({
  addIcon: {
    fontSize: 45
  },
  progress: {
    "margin-top": "25px"
  }
});

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

class UploadComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      previewVisible: false,
      selectedImg: null, //for modal dialog
      loader: "inline-block",
      uploadImg: "none",
      mobileBtnsActive: false
    };
  }

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  imageUploaded = async (res, file) => {
    var fileName = file.name;
    let idxDot = fileName.lastIndexOf(".") + 1;
    let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile === "jpg" || extFile === "jpeg" || extFile === "png") {
      const resizedFile = await resizeImage(file);
      this.props.showEditor(resizedFile);
    } else {
      alert(this.props.t("settings:onlyimg"));
    }
  };

  deleteFile = e => {
    const index = e.target.closest("div").getAttribute("index");
    let img = this.props.photos[index];

    if (img.uid) {
      img.id = img.uid;
    }
    this.props.deleteImg({ file: img });
  };
  //modal
  handleClickOpen = e => {
    const index = e.target.closest("div").getAttribute("index");
    let img = this.props.photos[index];
    if (this.mounted) {
      this.setState(
        {
          selectedImg: img.url,
          previewVisible: true
        },
        this.props.toggleScroll(true)
      );
    }
  };

  handleClickProPic = e => {
    const index = e.target.closest("div").getAttribute("index");
    let img = this.props.photos[index];
    this.props.showCropper(process.env.REACT_APP_S3_BUCKET_URL + img.key);
  };

  handleClose = () => {
    if (this.mounted) {
      this.setState({ previewVisible: false }, this.props.toggleScroll(false));
    }
  };
  switchLoader = () => {
    if (this.mounted) {
      this.setState({
        loader: "none",
        uploadImg: "block"
      });
    }
  };

  toggleMobileBtns = () => {
    this.setState({ mobileBtnsActive: !this.state.mobileBtnsActive });
  };
  closeMobileBtns = () => {
    this.setState({ mobileBtnsActive: false });
  };

  render() {
    const { classes, photos, t, isBlackMember } = this.props;
    const { selectedImg, previewVisible, mobileBtnsActive } = this.state;
    return (
      <div className="header-container">
        {photos.map((file, index) => {
          return (
            <div key={file.uid || file.id}>
              <div className="loader">
                <div className="loading">
                  <CircularProgress
                    style={{ display: this.state.loader }}
                    className={classes.progress}
                  />
                </div>

                <div
                  title={t("deletepic")}
                  className="delete box"
                  index={index}
                >
                  <DeleteIcon
                    style={{
                      cursor: "pointer",
                      fontSize: "40px",
                      color: "#999"
                    }}
                    onClick={this.deleteFile}
                  />
                </div>
              </div>

              <div
                className="imgContainer"
                style={{ display: this.state.uploadImg }}
                onBlur={this.closeMobileBtns}
                tabIndex={0}
              >
                <img
                  className="img-box"
                  src={file.smallUrl || file.url}
                  onLoad={this.switchLoader}
                  alt=""
                  onClick={this.toggleMobileBtns}
                />
                {mobileBtnsActive && (
                  <div
                    className={
                      !this.props.isPrivate ? "tooltip" : "tooltip priv"
                    }
                  >
                    <span className="tooltiptext show">
                      <div className="mobilebtns">
                        <div title={t("deletepic")} index={index}>
                          <DeleteIcon
                            style={{ cursor: "pointer", fontSize: 30 }}
                            onClick={this.deleteFile}
                          />
                          {t("common:Delete")}
                        </div>
                        {!this.props.isPrivate && (
                          <div title={t("updatepro")} index={index}>
                            <StarIcon
                              style={{ cursor: "pointer", fontSize: 30 }}
                              onClick={this.handleClickProPic}
                            />

                            {t("common:Profile")}
                          </div>
                        )}{" "}
                        <div title={t("viewpic")} index={index}>
                          <ViewIcon
                            style={{ cursor: "pointer", fontSize: 30 }}
                            onClick={this.handleClickOpen}
                          />
                          {t("common:View")}
                        </div>
                      </div>
                    </span>
                  </div>
                )}
                <div className="btns">
                  <div title={t("deletepic")} index={index}>
                    <DeleteIcon
                      style={{ cursor: "pointer" }}
                      onClick={this.deleteFile}
                    />
                  </div>
                  {!this.props.isPrivate && (
                    <div title={t("updatepro")} index={index}>
                      <StarIcon
                        style={{ cursor: "pointer" }}
                        onClick={this.handleClickProPic}
                      />
                    </div>
                  )}{" "}
                  <div title={t("viewpic")} index={index}>
                    <ViewIcon
                      style={{ cursor: "pointer" }}
                      onClick={this.handleClickOpen}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {photos.length >= 4 && !isBlackMember ? null : (
          <div className="box">
            <Upload
              onSuccess={this.imageUploaded}
              onError={err => console.error(err)}
              accept=".jpg,.jpeg,.png"
              customRequest={dummyRequest}
            >
              <div className="upload-box">
                <AddIcon className={classes.addIcon} />
                <p className="text">{t("Upload")}</p>
              </div>
            </Upload>
          </div>
        )}
        {previewVisible && (
          <Lightbox mainSrc={selectedImg} onCloseRequest={this.handleClose} />
        )}
      </div>
    );
  }
}

UploadComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadComponent);
