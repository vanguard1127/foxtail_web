import React, { useState } from "react";
import Upload from "rc-upload";
import "./UploadImageComponentStyle.css";
import ImageEditor from "../../Modals/ImageEditor";
import ImageCropper from "../../Modals/ImageCropper";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import ViewIcon from "@material-ui/icons/RemoveRedEye";
import StarIcon from "@material-ui/icons/Grade";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Lightbox from "react-image-lightbox";

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

const UploadComponent = ({
  classes,
  photos,
  t,
  single,
  isBlackMember,
  handlePhotoListChange,
  handleUpload,
  ErrorHandler,
  setProfilePic
}) => {
  const [editorVisible, setEditorVisible] = useState(false);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [loader, setLoader] = useState("inline-block");
  const [uploadImg, setUploadImg] = useState("none");
  const [mobileBtnsActive, setMobileBtnsActive] = useState(false);
  const [fileRecieved, setFileRecieved] = useState(undefined);
  const [isPrivate, setIsPrivate] = useState(false);

  const toggleImgEditorPopup = (file, isPrivate) => {
    ErrorHandler.setBreadcrumb("Toggle image editor");

    setFileRecieved(file);
    setIsPrivate(isPrivate);
    setEditorVisible(!editorVisible);
  };

  const toggleImgCropperPopup = url => {
    ErrorHandler.setBreadcrumb("Toggle image cropper");
    setFileRecieved(url);
    setCropperVisible(!cropperVisible);
  };

  const imageUploaded = (res, file) => {
    var fileName = file.name;
    let idxDot = fileName.lastIndexOf(".") + 1;
    let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile === "jpg" || extFile === "jpeg" || extFile === "png") {
      if (file.size > 7000000) {
        alert(t("only7mb"));
      } else {
        setFileRecieved(file);
        setIsPrivate(isPrivate);
        setEditorVisible(true);
      }
    } else {
      alert(t("onlyimg"));
    }
  };

  const deleteFile = e => {
    const index = e.target.closest("div").getAttribute("index");
    let img = photos[index];

    if (img && img.uid) {
      img.id = img.uid;
    }

    handlePhotoListChange({
      file: img,
      isPrivate,
      isDeleted: true
    });
  };
  //modal
  const handleClickOpen = e => {
    const index = e.target.closest("div").getAttribute("index");
    let img = photos[index];
    setPreviewVisible(true);
    setSelectedImg(img.url);
  };

  const handleClickProPic = e => {
    const index = e.target.closest("div").getAttribute("index");
    let img = photos[index];
    setFileRecieved(process.env.REACT_APP_S3_BUCKET_URL + img.key);
    setCropperVisible(true);
  };

  const handleClose = () => {
    setPreviewVisible(true);
  };
  const switchLoader = () => {
    setLoader("none");
    setUploadImg("block");
  };

  const toggleMobileBtns = () => {
    setMobileBtnsActive(!mobileBtnsActive);
  };
  const closeMobileBtns = () => {
    setMobileBtnsActive(false);
  };

  const uploadAndClose = file => {
    handleUpload(file);
    toggleImgEditorPopup();
  };

  const editorPopup = editorVisible && (
    <ImageEditor
      file={fileRecieved}
      handleUpload={uploadAndClose}
      close={toggleImgEditorPopup}
      ErrorHandler={ErrorHandler}
    />
  );

  const cropperPopup = cropperVisible && (
    <ImageCropper
      imgUrl={fileRecieved}
      close={toggleImgCropperPopup}
      ErrorHandler={ErrorHandler}
      handleUpload={handleUpload}
      setProfilePic={({ key, url }) =>
        setProfilePic({
          key,
          url
        })
      }
    />
  );

  if (single) {
    return (
      <div className="header-container">
        {photos.length > 0 ? (
          <div
            className="imgContainer"
            style={{ display: uploadImg }}
            onBlur={closeMobileBtns}
            tabIndex={0}
          >
            <img
              className="img-box"
              src={photos[0] && photos[0].url}
              onLoad={switchLoader}
              alt=""
              onClick={toggleMobileBtns}
            />
            {mobileBtnsActive && (
              <div className={!isPrivate ? "tooltip" : "tooltip priv"}>
                <span className="tooltiptext show">
                  <div className="mobilebtns">
                    <div title={t("deletepic")} index={0}>
                      <DeleteIcon
                        style={{ cursor: "pointer", fontSize: 30 }}
                        onClick={deleteFile}
                      />
                      {t("common:Delete")}
                    </div>
                  </div>
                </span>
              </div>
            )}
            <div className="btns">
              <div title={t("deletepic")} index={0}>
                <DeleteIcon
                  style={{ cursor: "pointer" }}
                  onClick={deleteFile}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="box">
            <Upload
              onSuccess={imageUploaded}
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

        {editorPopup}
        {cropperPopup}
      </div>
    );
  }
  return (
    <div className="header-container">
      {photos.map((file, index) => {
        return (
          <div key={file.uid || file.id}>
            <div className="loader">
              <div className="loading">
                <CircularProgress
                  style={{ display: loader }}
                  className={classes.progress}
                />
              </div>

              <div title={t("deletepic")} className="delete box" index={index}>
                <DeleteIcon
                  style={{
                    cursor: "pointer",
                    fontSize: "40px",
                    color: "#999"
                  }}
                  onClick={deleteFile}
                />
              </div>
            </div>

            <div
              className="imgContainer"
              style={{ display: uploadImg }}
              onBlur={closeMobileBtns}
              tabIndex={0}
            >
              <img
                className="img-box"
                src={file.smallUrl || file.url}
                onLoad={switchLoader}
                alt=""
                onClick={toggleMobileBtns}
              />
              {mobileBtnsActive && (
                <div className={!isPrivate ? "tooltip" : "tooltip priv"}>
                  <span className="tooltiptext show">
                    <div className="mobilebtns">
                      <div title={t("deletepic")} index={index}>
                        <DeleteIcon
                          style={{ cursor: "pointer", fontSize: 30 }}
                          onClick={deleteFile}
                        />
                        {t("common:Delete")}
                      </div>
                      {!isPrivate && (
                        <div title={t("updatepro")} index={index}>
                          <StarIcon
                            style={{ cursor: "pointer", fontSize: 30 }}
                            onClick={handleClickProPic}
                          />

                          {t("common:Profile")}
                        </div>
                      )}{" "}
                      <div title={t("viewpic")} index={index}>
                        <ViewIcon
                          style={{ cursor: "pointer", fontSize: 30 }}
                          onClick={handleClickOpen}
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
                    onClick={deleteFile}
                  />
                </div>
                {!isPrivate && (
                  <div title={t("updatepro")} index={index}>
                    <StarIcon
                      style={{ cursor: "pointer" }}
                      onClick={handleClickProPic}
                    />
                  </div>
                )}{" "}
                <div title={t("viewpic")} index={index}>
                  <ViewIcon
                    style={{ cursor: "pointer" }}
                    onClick={handleClickOpen}
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
            onSuccess={imageUploaded}
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
        <Lightbox mainSrc={selectedImg} onCloseRequest={handleClose} />
      )}
    </div>
  );
};

UploadComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadComponent);
