import React, { useState } from "react";
import Upload from "rc-upload";
import { Prompt, useHistory } from "react-router-dom";
import "./UploadImageComponentStyle.css";
import ImageEditor from "../../Modals/ImageEditor";
// import ImageCropper from "../../Modals/ImageCropper"; // not used
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

const UploadComponent = ({
  classes,
  photos,
  t,
  single,
  isBlackMember,
  handlePhotoListChange,
  handleUpload,
  ErrorHandler,
  setProfilePic,
  uploadOnly,
  uploadButton,
  toggleCB
}) => {
  const [editorVisible, setEditorVisible] = useState(false);
  //TODO: DO WE NEED THIS
  // const [cropperVisible, setCropperVisible] = useState(false); // not used
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [loader, setLoader] = useState("inline-block");
  const [uploadImg, setUploadImg] = useState("none");
  const [mobileBtnsActive, setMobileBtnsActive] = useState(false);
  const [fileRecieved, setFileRecieved] = useState(undefined);
  const [isPrivate, setIsPrivate] = useState(false);
  const history = useHistory(); // this is used to keep the same url after closing image with back button

  const toggleImgEditorPopup = (file, isPrivate) => {
    ErrorHandler.setBreadcrumb("Toggle image editor");
    setFileRecieved(file);
    setIsPrivate(isPrivate);
    setEditorVisible(!editorVisible);
    if (toggleCB) {
      toggleCB();
    }
  };

  const imageUploaded = async (res, file) => {
    var fileName = file.name;
    let idxDot = fileName.lastIndexOf(".") + 1;
    let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile === "jpg" || extFile === "jpeg" || extFile === "png") {
      if (file.size > 7000000) {
        alert(t("only10mb"));
      } else {
        const resizedFile = await resizeImage(file);
        setFileRecieved(resizedFile);
        setIsPrivate(isPrivate);
        setEditorVisible(true);
        if (toggleCB) {
          toggleCB();
        }
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

  //TODO: ARE WE USING THIS
  const handleClickProPic = e => {
    console.log("SetProfilePic");
    const index = e.target.closest("div").getAttribute("index");
    let img = photos[index];
    setFileRecieved(process.env.REACT_APP_S3_BUCKET_URL + img.key);
    // setCropperVisible(true); // not used
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

  if (uploadOnly) {
    return (
      <div>
        <Upload
          onSuccess={imageUploaded}
          onError={err => console.error(err)}
          accept=".jpg,.jpeg,.png"
          customRequest={dummyRequest}
        >
          {uploadButton}
        </Upload>

        {editorPopup}
      </div>
    );
  }

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
        <Prompt
          message={(location, actionType) => {
            if (actionType === "POP") {
              history.goForward();
              setPreviewVisible(false);
              return false;
            } else {
              return true;
            }
          }}
          when={previewVisible}
        />
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
      <Prompt
        message={(location, actionType) => {
          if (actionType === "POP") {
            history.goForward();
            setPreviewVisible(false);
            return false;
          } else {
            return true;
          }
        }}
        when={previewVisible}
      />
    </div>
  );
};

UploadComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadComponent);
