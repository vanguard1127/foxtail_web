import React, { useState } from "react";
import { Prompt, useHistory } from "react-router-dom";
import Upload from "rc-upload";
import Lightbox from "react-image-lightbox";
import { WithT } from "i18next";
import { CircularProgress } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import ViewIcon from "@material-ui/icons/RemoveRedEye";
import StarIcon from "@material-ui/icons/Grade";

import resizeImage from "utils/resizeImage";
import ImageEditor from "components/Modals/ImageEditor";

import "./UploadBoxStyles.css";



interface IUploadBoxProps extends WithT {
  photos: any,
  handleUpload: (file: any) => any,
  ErrorHandler: any,
  toggleCB: () => void,
  uploadButton?: React.ReactElement,
  uploadOnly?: boolean,
  single?: boolean,
  handlePhotoListChange?: any,
  isBlackMember?: boolean,
}

const UploadBox: React.FC<IUploadBoxProps> = ({
  photos,
  handleUpload,
  ErrorHandler,
  toggleCB,
  uploadButton = null,
  uploadOnly = false,
  single = false,
  handlePhotoListChange = () => { }, // todo, noone passes this prop
  isBlackMember = false, // todo, currently no one passes this prop, review
  t,
}) => {
  const [editorVisible, setEditorVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');
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
        alert(t("settings:only10mb"));
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
      alert(t("settings:onlyimg"));
    }
  };

  const deleteFile = (index) => {
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
  const handleClickOpen = (index) => {
    let img = photos[index];
    setPreviewVisible(true);
    setSelectedImg(img.url);
  };

  //TODO: ARE WE USING THIS
  const handleClickProPic = (index) => {
    console.log("SetProfilePic");
    let img = photos[index];
    setFileRecieved(process.env.REACT_APP_S3_BUCKET_URL + img.key);
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
    setEditorVisible(!editorVisible);
    if (toggleCB) {
      toggleCB();
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
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
                    <div title={t("deletepic")}>
                      <DeleteIcon
                        style={{ cursor: "pointer", fontSize: 30 }}
                        onClick={() => deleteFile(0)}
                      />
                      {t("common:Delete")}
                    </div>
                  </div>
                </span>
              </div>
            )}
            <div className="btns">
              <div title={t("deletepic")}>
                <DeleteIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteFile(0)}
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
                  <AddIcon style={{ fontSize: 45 }} />
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
                <CircularProgress style={{ display: loader, marginTop: 25 }} />
              </div>
              <div title={t("deletepic")} className="delete box">
                <DeleteIcon
                  style={{
                    cursor: "pointer",
                    fontSize: "40px",
                    color: "#999"
                  }}
                  onClick={() => deleteFile(index)}
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
                      <div title={t("deletepic")}>
                        <DeleteIcon
                          style={{ cursor: "pointer", fontSize: 30 }}
                          onClick={() => deleteFile(index)}
                        />
                        {t("common:Delete")}
                      </div>
                      {!isPrivate && (
                        <div title={t("updatepro")}>
                          <StarIcon
                            style={{ cursor: "pointer", fontSize: 30 }}
                            onClick={() => handleClickProPic(index)}
                          />

                          {t("common:Profile")}
                        </div>
                      )}{" "}
                      <div title={t("viewpic")}>
                        <ViewIcon
                          style={{ cursor: "pointer", fontSize: 30 }}
                          onClick={() => handleClickOpen(index)}
                        />
                        {t("common:View")}
                      </div>
                    </div>
                  </span>
                </div>
              )}
              <div className="btns">
                <div title={t("deletepic")}>
                  <DeleteIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteFile(index)}
                  />
                </div>
                {!isPrivate && (
                  <div title={t("updatepro")}>
                    <StarIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleClickProPic(index)}
                    />
                  </div>
                )}{" "}
                <div title={t("viewpic")}>
                  <ViewIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClickOpen(index)}
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
              <AddIcon style={{ fontSize: 45 }} />
              <p className="text">{t("Upload")}</p>
            </div>
          </Upload>
        </div>
      )}
      {previewVisible && selectedImg && (
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

export default UploadBox;
