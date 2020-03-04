import React, { PureComponent } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import RotateIcon from "@material-ui/icons/RotateRight";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

class EditCanvasImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      x_pos: 0,
      y_pos: 0,
      rotation: 0,
      uploading: false,
      scale: 1,
      imageWidth: 0,
      imageHeight: 0,
      init_x: 0,
      init_y: 0,
      cropperReady: false
    };
    this.pixelRatio = 1;
  }

  componentDidMount() {
    this.mounted = true;
    this.checkSize();
    window.addEventListener("resize", this.checkSize);
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener("resize", this.checkSize);
  }

  checkSize = () => {
    const width = this.container.offsetWidth;
    const height = window.innerHeight - 56; // here also we've subtract topbar height

    this.setState({ width, height });
  };

  handleExportClick = async () => {
    const { uploading } = this.state;
    if (this.mounted && !uploading) {
      this.setState({ uploading: true }, async () => {
        const dataURL = await this.cropper
          .getCroppedCanvas({ width: 250, height: 250 })
          .toDataURL();
        const blobResp = await fetch(dataURL);
        const blobData = await blobResp.blob();

        if (Object.getOwnPropertyNames(blobData).length < 0) {
          this.props.ErrorHandler.catchErrors({
            error: "Data Blob ERROR: File not loaded properly. File object:",
            blobData,
            dataURL
          });
          window.location.reload(false);
        }
        const file = {
          filename: "",
          filetype: "image/jpeg",
          filebody: blobData,
          dataURL
        };

        await this.handleUpload(file);
      });
    }
  };

  handleUpload = async file => {
    const {
      signS3,
      setProfilePic,
      setS3PhotoParams,
      uploadToS3,
      close
    } = this.props;
    file.filename = "propic.jpg";
    await setS3PhotoParams(file.filetype);
    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key } = data.signS3;

        if (signedRequest === "https://s3.amazonaws.com/") {
          this.props.ErrorHandler.catchErrors({
            error: "ERROR: File not loaded properly. File object:",
            file
          });
        }

        await uploadToS3(file.filebody, signedRequest);

        await setProfilePic({ key, url: file.dataURL });
        close();
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res);
      });
  };

  handleScale = isZoom => {
    if (this.mounted) {
      let scale;
      if (isZoom) {
        scale = this.state.scale + this.state.scale * 0.1;
      } else {
        scale = this.state.scale - this.state.scale * 0.1;
      }
      this.setState(
        {
          scale
        },
        () => {
          const containerData = this.cropper.getContainerData();

          this.cropper.zoomTo(this.state.scale, {
            x: containerData.width / 2,
            y: containerData.height / 2
          });
        }
      );
    }
  };

  rotate = () => {
    if (this.mounted) {
      this.setState(
        {
          rotation: this.state.rotation + 90
        },
        () => this.cropper.rotateTo(this.state.rotation)
      );
    }
  };

  render() {
    const { uploading, height, width, cropperReady } = this.state;
    const { t, imgUrl, close } = this.props;

    return (
      <div className="edit-canvas-image-div">
        <div className="edit-canvas-image-wrapper">
          <div
            ref={node => {
              this.container = node;
            }}
          >
            <Cropper
              ref={cropper => (this.cropper = cropper)}
              src={imgUrl}
              style={{ height, width }}
              responsive={true}
              viewMode={1}
              center={false}
              dragMode="move"
              cropBoxMovable={false}
              toggleDragModeOnDblclick={false}
              cropBoxResizable={false}
              // Cropper.js options
              aspectRatio={1}
              guides={false}
              ready={() => this.setState({ cropperReady: true })}
            />
          </div>
          {cropperReady && (
            <div className="edit-canvas-action-bar-wrapper">
              <div className="edit-canvas-action-bar">
                <div className="edit-canvas-action-div">
                  <IconButton
                    className="edit-canvas-action-icon-button"
                    onClick={() => this.handleScale(true)}
                  >
                    <AddIcon className="edit-canvas-action-icon" />
                  </IconButton>
                  <IconButton
                    className="edit-canvas-action-icon-button"
                    onClick={() => this.handleScale(false)}
                  >
                    <RemoveIcon className="edit-canvas-action-icon" />
                  </IconButton>
                </div>
                <IconButton
                  className="edit-canvas-action-icon-button"
                  onClick={this.rotate}
                >
                  <RotateIcon className="edit-canvas-action-icon" />
                </IconButton>
              </div>
            </div>
          )}
        </div>

        <div className="edit-canvas-dialog-topbar">
          <div>
            <span style={{ fontSize: "20px", color: "white" }}>
              {cropperReady ? (
                t("Profile Picture Selector")
              ) : (
                <CircularProgress />
              )}
            </span>
          </div>
          <div>
            {cropperReady && (
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleExportClick}
                className="green-button-small"
              >
                {!uploading ? t("Save") : t("Uploading")}
              </Button>
            )}
            <Button
              style={{ color: "white", marginLeft: "8px" }}
              onClick={close}
            >
              {t("Cancel")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default EditCanvasImage;
