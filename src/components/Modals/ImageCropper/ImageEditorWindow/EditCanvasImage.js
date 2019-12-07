import React, { PureComponent } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
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
      init_y: 0
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

    //TODO: figure out resize
    // var vx_pos = x_pos;

    // var vimageWidth = imageWidth;
    // if (vimageWidth * scale < width) {
    //   if (x_pos - vimageWidth / 2 + vimageWidth * scale > width) {
    //     vx_pos = width - vimageWidth * scale + vimageWidth / 2;
    //   }
    // } else {
    //   vx_pos = width / 2;
    //   vimageWidth = width / scale;
    // }
    // var vy_pos = y_pos;
    // var vimageHeight = imageHeight;
    // if (imageHeight * scale < height) {
    //   if (y_pos - vimageHeight / 2 + imageHeight * scale > height) {
    //     vy_pos = height - imageHeight * scale + vimageHeight / 2;
    //   }
    // } else {
    //   vy_pos = height / 2;
    //   vimageHeight = height / scale;
    // }

    // this.setState({
    //   width: width,
    //   height: height,
    //   x_pos: vx_pos,
    //   y_pos: vy_pos,
    //   imageWidth: vimageWidth,
    //   imageHeight: vimageHeight
    // });
  };

  dataURItoBlob = dataURI => {
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
  };

  handleExportClick = async () => {
    const { uploading } = this.state;
    if (this.mounted && !uploading) {
      this.setState({ uploading: true }, async () => {
        const dataURL = await this.cropper
          .getCroppedCanvas({ width: 250, height: 250 })
          .toDataURL();
        const blobData = await this.dataURItoBlob(dataURL);
        const file = {
          filename: "",
          filetype: "image/jpeg",
          filebody: blobData
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

    await setS3PhotoParams(file.filename, file.filetype);
    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key, url } = data.signS3;

        if (signedRequest === "https://s3.amazonaws.com/") {
          this.props.ErrorHandler.catchErrors({
            error: "ERROR: File not loaded properly. File object:",
            file
          });
        }

        await uploadToS3(file.filebody, signedRequest);

        await setProfilePic({ key, url });
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
    const { uploading, height, width } = this.state;
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
            />
          </div>

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
        </div>

        <div className="edit-canvas-dialog-topbar">
          <div>
            <span style={{ fontSize: "20px", color: "white" }}>
              {t("Profile Picture Selector")}
            </span>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleExportClick}
              className="green-button-small"
            >
              {!uploading ? t("Save") : t("Uploading")}
            </Button>
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
