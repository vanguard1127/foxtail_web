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
import { Button } from "@material-ui/core";

class EditCanvasImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
      isShowStickers: false
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
    const { imageHeight, imageWidth, x_pos, y_pos, scale } = this.state;
    const width = this.container.offsetWidth;
    const height = window.innerHeight;

    this.setState({ width, height });
    if (imageWidth == 0 || imageHeight == 0) {
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
    if (this.mounted && !uploading && this.SourceImageRef) {
      this.setState({ hideTransformer: true, uploading: true }, () => {
        const rotDegrees = rotation % 360;
        const scaledImgWidth =
          rotDegrees == 0 || rotDegrees == 180
            ? imageWidth * scale
            : imageHeight * scale;
        const scaledImgHeight =
          rotDegrees == 0 || rotDegrees == 180
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

        this.handleUpload(file);
      });
    }
  };

  //TODO: REMEMBER DRAG NO  LONGER RELATES TO IMAGE
  handleDragEnd = e => {
    let { rotation, x_pos, y_pos, width } = this.state;

    const canvasWidth = width;
    const canvasHeight = (window.innerHeight * 70) / 100;

    const rotationC = rotation % 360;

    const imgWidth =
      rotationC == 0 || rotationC == 180
        ? this.state.imageWidth * this.state.scale
        : this.state.imageHeight * this.state.scale;
    const imgHeight =
      rotationC == 0 || rotationC == 180
        ? this.state.imageHeight * this.state.scale
        : this.state.imageWidth * this.state.scale;

    const offsetX = imgWidth / 2;
    const offsetY = imgHeight / 2;

    if (x_pos - offsetX < 0) {
      x_pos = offsetX;
    } else {
      if (x_pos - offsetX + imgWidth > canvasWidth) {
        console.log("X out");
        x_pos = canvasWidth - imgWidth + offsetX;
      }
    }
    if (y_pos - offsetY < 0) {
      y_pos = offsetY;
    } else {
      console.log("Y out");
      if (y_pos - offsetY + imgHeight > canvasHeight) {
        y_pos = canvasHeight - imgHeight + offsetY;
      }
    }
    e.target.to({
      duration: 0,
      x: x_pos,
      y: y_pos
    });
    this.setState({ x_pos, y_pos });
    this.props.dragComplete(x_pos, y_pos);

    // if (left_pos > 0) {
    //   e.target.to({
    //     duration: 0,
    //     x: 0
    //   });
    // } else if (left_pos + width < this.state.width) {
    //   e.target.to({
    //     duration: 0,
    //     x: this.state.width - scaleWidth
    //   });
    // }
    // if (e.target.y() > 0) {
    //   e.target.to({
    //     duration: 0,
    //     y: 0
    //   });
    // } else if (right_pos + scaleHeight < this.state.height) {
    //   e.target.to({
    //     duration: 0,
    //     y: this.state.height - scaleHeight
    //   });
    // }
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
    // format name on backend
    // filename: this.formatFilename(file.name),
    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key, url } = data.signS3;

        await uploadToS3(file.filebody, signedRequest);

        await handlePhotoListChange({ file, key, url });
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

  handleStickerClick = (id, name, src) => {
    const { rotation } = this.state;

    let x = 0;
    let y = 0;

    //TODO: Figure out what to put here
    x = 0 - 50;
    y = 0 - 50;

    let imgList = [...this.state.konvaImageList];
    imgList = [...imgList, { id, name, src, x, y, rotation: 0 - rotation }];
    if (this.mounted) {
      this.setState({ konvaImageList: imgList });
    }
  };

  removeSelectedSticker = () => {
    const filteredList = this.state.konvaImageList.filter(
      x => x.name !== this.state.selectedShapeName
    );
    if (this.mounted) {
      this.setState({ konvaImageList: filteredList, selectedShapeName: "" });
    }
  };

  rotate = () => {
    if (this.mounted) {
      this.setState(
        {
          rotation: this.state.rotation + 90,
          konvaImageList: this.state.konvaImageList.map(konvaImage => {
            return {
              ...konvaImage,
              rotation: konvaImage.rotation + 90,
              x: konvaImage.x,
              y: konvaImage.y
            };
          })
        },
        () => console.log(this.state.konvaImageList, "konvaImageList")
      );
    }
  };

  handleShowStickers = () => {
    this.setState({ isShowStickers: !this.state.isShowStickers });
  };

  handleScalePlus = () => {
    if (this.mounted) {
      let scale = this.state.scale + 0.1;
      this.setState({
        scale: scale > 2 ? 2 : scale
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
      rotation
    } = this.state;
    const { t } = this.props;
    const Sticker = props => (
      <div
        {...props}
        onClick={() => this.handleStickerClick(props.id, props.name, props.src)}
        style={{ padding: 5, height: "100%" }}
      >
        <img
          style={{ height: "100%" }}
          src={require("./" + props.src)}
          alt="imagepic"
        />
      </div>
    );

    return (
      <div className="edit-canvas-image-div">
        <div className="edit-canvas-image-wrapper">
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
            ref={node => {
              this.container = node;
            }}
          >
            <Stage
              style={{ backgroundColor: "#0e0d0dc7" }}
              width={width}
              height={window.innerHeight}
              onClick={this.handleStageClick}
              ref={node => {
                this.stageRef = node;
              }}
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
                    const top = 56 + this.state.imageHeight / 2;
                    const left = this.state.imageWidth / 2;
                    const bottom =
                      window.innerHeight - this.state.imageHeight / 2;
                    const right = this.state.width - this.state.imageWidth / 2;
                    const rotDegrees = rotation % 360;

                    let x = pos.x;
                    let y = pos.y;
                    if (pos.y > bottom) {
                      y = rotDegrees === 0 ? bottom : left;
                    } else if (pos.y < top) {
                      y = rotDegrees === 0 ? top : right;
                    }
                    if (pos.x > right) {
                      x = rotDegrees === 0 ? right : top;
                    } else if (pos.x < left) {
                      x = rotDegrees === 0 ? left : bottom;
                    }
                    return {
                      x,
                      y
                    };
                  }}
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
                      var x = img.x;
                      var y = img.y;

                      return (
                        <KonvaImage
                          src={img.src}
                          key={img.id + idx}
                          onDragStart={this.handleDragStart}
                          width={100}
                          height={100}
                          name={img.name}
                          x={x}
                          y={y}
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
          {isShowStickers ? (
            <div className="edit-canvas-stickers-wrapper">
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
                  <div className="edit-canvas-stickers-div-close-button-div">
                    <IconButton
                      style={{ padding: "unset", outline: "none" }}
                      onClick={this.handleShowStickers}
                    >
                      <CloseIcon style={{ fontSize: "12px" }} />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="edit-canvas-dialog-topbar">
          <div>
            <span style={{ fontSize: "20px", color: "white" }}>
              Foxtail Privacy Studio
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
              onClick={() => this.props.close()}
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
