import React, { PureComponent } from "react";
import { Layer, Stage, Group } from "react-konva";
import TransformerHandler from "./TransformerHandler";
import SourceImage from "./SourceImage";
import KonvaImage from "./KonvaImage";
import RotateIcon from "@material-ui/icons/RotateRight";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import IconButton from "@material-ui/core/IconButton";
import FaceIcon from "@material-ui/icons/Face";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import { Spring } from "react-spring/renderprops";
import { toast } from "react-toastify";

class EditCanvasImage extends PureComponent {
  lastDist = 0;
  startScale = 1;
  pixelRatio = 1;
  state = {
    width: 0,
    height: 0,
    x_pos: 0,
    y_pos: 0,
    selectedShapeName: "",
    hideTransformer: false,
    konvaImageList: [],
    rotation: 0,
    uploading: false,
    scale: 1,
    imageWidth: 0,
    imageHeight: 0,
    init_x: 0,
    init_y: 0,
    isShowStickers: false,
    certChecked: false
  };

  componentDidMount() {
    this.mounted = true;
    this.checkSize();
    // window.addEventListener("resize", this.checkSize);
    document.addEventListener("mousedown", this.handleClick);
    document.addEventListener("touchstart", this.handleClick);
  }

  componentWillUnmount() {
    this.mounted = false;
    // window.removeEventListener("resize", this.checkSize);
    document.removeEventListener("mousedown", this.handleClick);
    document.removeEventListener("touchstart", this.handleClick);
  }

  checkSize = () => {
    const { imageHeight, imageWidth, x_pos, y_pos, scale } = this.state;
    const width = this.container.offsetWidth;
    const height = window.innerHeight - 56; // here also we've subtract topbar height
    //window.scrollTo(0, 1);
    if (!this.props.imageObject) {
      toast.error("Image upload error has occured please try again.");
      return;
    }
    this.setState({ width, height });
    if (imageWidth === 0 || imageHeight === 0) {
      const reader = new FileReader();

      reader.readAsDataURL(this.props.imageObject);
      reader.onload = e => {
        const imageBase64 = e.target.result;
        const image = new window.Image();
        image.src = imageBase64;
        image.onload = function() {
          var initImageWidth = image.width;
          var initImageHeight = image.height;
          while (
            initImageHeight > height ||
            initImageHeight > width ||
            initImageWidth > width ||
            initImageWidth > height
          ) {
            this.pixelRatio = this.pixelRatio * 1.1;
            initImageHeight = initImageHeight / 1.1;
            initImageWidth = initImageWidth / 1.1;
          }
          const x_pos = (width - initImageWidth) / 2;
          const y_pos = (height - initImageHeight) / 2;

          this.setState({
            imageWidth: initImageWidth,
            imageHeight: initImageHeight,
            x_pos: x_pos + initImageWidth / 2,
            y_pos: y_pos + initImageHeight / 2,
            init_x: x_pos + initImageWidth / 2,
            init_y: y_pos + initImageHeight / 2
          });
        }.bind(this);
      };
    }

    if (x_pos == 0 || y_pos == 0) {
      return;
    }

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

  handleStageClick = e => {
    if (this.mounted) {
      this.setState({
        selectedShapeName: e.target.name()
      });
    }
  };

  dataURItoBlob = dataURI => {
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
  };

  handleExportClick = () => {
    const { rotation, imageHeight, imageWidth, scale, uploading } = this.state;
    const { t } = this.props;
    if (this.mounted && !uploading && this.SourceImageRef) {
      this.setState({ hideTransformer: true, uploading: true }, async () => {
        if (!toast.isActive("upload")) {
          toast.success(t("secupload"), {
            toastId: "upload",
            autoClose: false,
            hideProgressBar: false
          });
        }
        const rotDegrees = rotation % 360;
        const scaledImgWidth =
          rotDegrees === 0 || rotDegrees === 180
            ? imageWidth * scale
            : imageHeight * scale;
        const scaledImgHeight =
          rotDegrees === 0 || rotDegrees === 180
            ? imageHeight * scale
            : imageWidth * scale;

        const x = this.groupRef.x() - scaledImgWidth / 2;
        const y = this.groupRef.y() - scaledImgHeight / 2;

        const dataURL = this.groupRef.toDataURL({
          mimeType: "image/jpeg",
          x,
          y,
          width: scaledImgWidth,
          height: scaledImgHeight,
          quality: 1,
          pixelRatio: this.pixelRatio
        });

        const blobData = this.dataURItoBlob(dataURL);
        const file = {
          filename: this.props.imageObject.name,
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
      handlePhotoListChange,
      setS3PhotoParams,
      uploadToS3,
      close
    } = this.props;
    await setS3PhotoParams(file.filename, file.filetype);

    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key, url } = data.signS3;

        await uploadToS3(file.filebody, signedRequest);

        await handlePhotoListChange({ file, key, url });
        toast.dismiss();
        close();
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  handleDragStart = e => {
    const shapeName = e.target.attrs.name;
    if (this.state.selectedShapeName !== shapeName) {
      if (this.mounted) {
        this.setState({ selectedShapeName: shapeName });
      }
    }
  };

  handleTouchStart = e => {
    const shapeName = e.target.attrs.name;
    if (this.state.selectedShapeName !== shapeName) {
      if (this.mounted) {
        this.setState({ selectedShapeName: shapeName });
      }
    }
  };

  handleStickerClick = (id, name, src) => {
    const { rotation } = this.state;

    let imgList = [...this.state.konvaImageList];
    imgList = imgList.map(img => Object.assign(img, { isNew: false }));
    imgList = [
      ...imgList,
      { id, name, src, rotation: 0 - rotation, isNew: true }
    ];
    if (this.mounted) {
      this.setState({ konvaImageList: imgList });
    }
  };

  removeSelectedSticker = () => {
    let filteredList = this.state.konvaImageList.filter(x => {
      if (x.name === this.state.selectedShapeName) {
        return Object.assign(x, { isDeleted: true });
      }
      return x;
    });
    filteredList = filteredList.map(img =>
      Object.assign(img, { isNew: false })
    );
    if (this.mounted) {
      this.setState({ konvaImageList: filteredList, selectedShapeName: "" });
    }
  };

  rotate = () => {
    if (this.mounted) {
      this.setState({
        rotation: this.state.rotation + 90
      });
    }
  };

  handleShowStickers = () => {
    this.setState({ isShowStickers: !this.state.isShowStickers });
  };

  handleScalePlus = () => {
    if (this.mounted) {
      let scale = this.state.scale + 0.1;
      this.setState({
        scale: scale > 3 ? 3 : scale
      });
    }
  };

  handleScaleMinus = () => {
    if (this.mounted) {
      let scale = this.state.scale - 0.1;
      this.setState({
        scale: scale < 1 ? 1 : scale
      });
    }
  };

  setScale = scale => {
    if (this.mounted) {
      if (scale < 3 && scale > 1) {
        this.setState({
          scale
        });
      }
    }
  };

  getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  handleClick = e => {
    if (!this.stickerList.contains(e.target))
      this.setState({ isShowStickers: false });
  };

  toggleCert = () => {
    if (this.mounted) {
      this.setState({
        certChecked: !this.state.certChecked
      });
    }
  };

  render() {
    const {
      konvaImageList,
      width,
      height,
      x_pos,
      y_pos,
      init_x,
      init_y,
      hideTransformer,
      selectedShapeName,
      uploading,
      isShowStickers,
      rotation,
      certChecked
    } = this.state;
    const { t, close } = this.props;
    const Sticker = props => (
      <div
        {...props}
        onClick={() => this.handleStickerClick(props.id, props.name, props.src)}
        style={{ padding: 5 }}
      >
        <img
          style={{ maxHeight: "66px" }}
          src={require("./" + props.src)}
          alt="imagepic"
        />
      </div>
    );

    return (
      <div className="edit-canvas-image-div">
        <div className="edit-canvas-image-wrapper">
          <div
            /*style={{
              display: "flex",
              justifyContent: "center"
            }}*/
            ref={node => {
              this.container = node;
            }}
          >
            <Stage
              style={{ backgroundColor: "#0e0d0dc7" }}
              width={width}
              height={this.state.height} // here we've reduced height as topbar will take 56px top
              onClick={this.handleStageClick}
            >
              <Layer>
                <Group
                  rotation={this.state.rotation}
                  x={x_pos}
                  y={y_pos}
                  draggable
                  scaleX={this.state.scale}
                  scaleY={this.state.scale}
                  ref={node => {
                    this.groupRef = node;
                  }}
                  dragBoundFunc={pos => {
                    const rotDegrees = rotation % 360;
                    const upright =
                      rotDegrees == 0 || rotDegrees == 180 ? true : false;

                    const top = upright
                      ? this.state.imageHeight / 2
                      : this.state.imageWidth / 2;
                    const left = upright
                      ? this.state.imageWidth / 2
                      : this.state.imageHeight / 2;
                    const bottom = upright
                      ? this.state.height - this.state.imageHeight / 2
                      : this.state.height - this.state.imageWidth / 2; // here also we've subtract topbar height from canvas container
                    const right = upright
                      ? this.state.width - this.state.imageWidth / 2
                      : this.state.width - this.state.imageHeight / 2;

                    let x = pos.x;
                    let y = pos.y;

                    if (pos.y > bottom) {
                      y = bottom;
                    } else if (pos.y < top) {
                      y = top;
                    }

                    if (pos.x > right) {
                      x = right;
                    } else if (pos.x < left) {
                      x = left;
                    }

                    return {
                      x,
                      y
                    };
                  }}
                  // onTouchMove={res => {
                  //   res.evt.preventDefault();
                  //   const stage = res.currentTarget;
                  //   var touch1 = res.evt.touches[0];
                  //   var touch2 = res.evt.touches[1];

                  //   if (touch1 && touch2) {
                  //     var dist = this.getDistance(
                  //       {
                  //         x: touch1.clientX,
                  //         y: touch1.clientY
                  //       },
                  //       {
                  //         x: touch2.clientX,
                  //         y: touch2.clientY
                  //       }
                  //     );

                  //     if (!this.lastDist) {
                  //       this.lastDist = dist;
                  //     }

                  //     var scale = (stage.scaleX() * dist) / this.lastDist;
                  //     this.setScale(scale);

                  //     this.lastDist = dist;
                  //   }
                  // }}
                  // onTouchEnd={() => {
                  //   this.lastDist = 0;
                  // }}
                >
                  {this.props.imageObject && (
                    <SourceImage
                      ref={node => {
                        this.SourceImageRef = node;
                      }}
                      width={this.state.imageWidth}
                      height={this.state.imageHeight}
                      sourceImageObject={this.props.imageObject}
                    />
                  )}
                  {konvaImageList.length > 0 &&
                    konvaImageList.map((img, idx) => {
                      return (
                        <KonvaImage
                          src={img.src}
                          key={img.id + idx}
                          onDragStart={this.handleDragStart}
                          onTouchStart={this.handleTouchStart}
                          scale={this.state.scale}
                          isNew={img.isNew}
                          isDeleted={!!img.isDeleted}
                          name={img.name}
                          rotation={img.rotation}
                        />
                      );
                    })}
                  {hideTransformer === false && (
                    <TransformerHandler selectedShapeName={selectedShapeName} />
                  )}
                </Group>
              </Layer>
            </Stage>
          </div>

          <div className="edit-canvas-action-bar-wrapper">
            <div className="edit-canvas-action-bar">
              <div className="edit-canvas-action-div">
                <IconButton
                  className="edit-canvas-action-icon-button"
                  onClick={this.handleScalePlus}
                >
                  <AddIcon className="edit-canvas-action-icon" />
                </IconButton>
                <IconButton
                  className="edit-canvas-action-icon-button"
                  onClick={this.handleScaleMinus}
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
              <IconButton
                className="edit-canvas-action-icon-button"
                onClick={this.handleShowStickers}
              >
                <FaceIcon className="edit-canvas-action-icon" />
              </IconButton>
              {selectedShapeName && (
                <IconButton
                  className="edit-canvas-action-icon-button"
                  onClick={this.removeSelectedSticker}
                >
                  <DeleteIcon
                    className="edit-canvas-action-icon"
                    style={{
                      color: "red"
                    }}
                  />
                </IconButton>
              )}
            </div>
          </div>
          <div
            ref={node => {
              this.stickerList = node;
            }}
          >
            {isShowStickers ? (
              <Spring from={{ opacity: 0.6 }} to={{ opacity: 1 }}>
                {props => (
                  <div className="edit-canvas-stickers-wrapper" style={props}>
                    <div className="avatar-style-vectors">
                      <div className="content">
                        <Sticker
                          id="1"
                          name={`${Date.now()}str1`}
                          src="test_mask_1.png"
                        />
                        <Sticker
                          id="2"
                          name={`${Date.now()}str2`}
                          src="test_mask_2.png"
                        />
                        <Sticker
                          id="3"
                          name={`${Date.now()}str3`}
                          src="test_mask_3.png"
                        />
                        <Sticker
                          id="4"
                          name={`${Date.now()}str4`}
                          src="test_mask_4.png"
                        />
                        <Sticker
                          id="5"
                          name={`${Date.now()}str5`}
                          src="test_mask_5.png"
                        />
                        <Sticker
                          id="6"
                          name={`${Date.now()}str6`}
                          src="test_mask_6.png"
                        />
                      </div>
                      <div className="edit-canvas-stickers-div-close-button-div">
                        <IconButton
                          className="edit-canvas-stickers-div-close-button-div-button"
                          onClick={this.handleShowStickers}
                        >
                          <CloseIcon style={{ fontSize: "12px" }} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                )}
              </Spring>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="edit-canvas-dialog-topbar">
          <div>
            <span style={{ fontSize: "20px", color: "white" }}>
              Foxtail {t("Privacy Studio")}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {certChecked ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleExportClick}
                  className="green-button-small"
                >
                  {!uploading ? t("Save") : t("common:upload")}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.toggleCert}
                >
                  {t(
                    "I certify, I have explicit permission to post this image on Foxtail"
                  )}
                </Button>
              )}
              {!uploading && (
                <Button
                  style={{ color: "white", marginLeft: "8px" }}
                  onClick={close}
                >
                  {t("Cancel")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditCanvasImage;
