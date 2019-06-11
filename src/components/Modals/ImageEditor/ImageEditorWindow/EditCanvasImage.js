import React, { PureComponent } from "react";
import { Layer, Stage, Group } from "react-konva";
import TransformerHandler from "./TransformerHandler";
import SourceImage from "./SourceImage";
import KonvaImage from "./KonvaImage";
import RotateIcon from "@material-ui/icons/RotateRight";
import ImageIcon from "@material-ui/icons/Image";
import DeleteIcon from "@material-ui/icons/DeleteForever";

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
    const { imageHeight, imageWidth, x_pos, y_pos, scale } = this.state;
    const width = this.container.offsetWidth;
    const height = width / 3;

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
    if (this.mounted && !this.state.uploading && this.SourceImageRef) {
      this.setState({ hideTransformer: true, uploading: true }, () => {
        const rotation = this.state.rotation % 360;
        const width =
          rotation == 0 || rotation == 180
            ? this.state.imageWidth * this.state.scale
            : this.state.imageHeight * this.state.scale;
        const height =
          rotation == 0 || rotation == 180
            ? this.state.imageHeight * this.state.scale
            : this.state.imageWidth * this.state.scale;
        //TODO: get image height from group
        const x = this.state.x_pos - width / 2;
        const y = this.state.y_pos - height / 2;
        console.log("SAVE x", x, "y", y);
        const dataURL = this.groupRef.toDataURL({
          mimeType: "image/jpeg",
          x,
          y,
          width,
          height,
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

  handleScale = e => {
    const scale = parseFloat(e.target.value);
    if (this.mounted) {
      this.setState({
        scale: scale
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
      uploading
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ position: "relative", height: "70vh", width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "70vh"
            }}
            ref={node => {
              this.container = node;
            }}
          >
            <Stage
              style={{ backgroundColor: "#0e0d0dc7" }}
              width={width}
              height={(window.innerHeight * 70) / 100}
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
                  //onDragEnd={this.handleDragEnd}
                  ref={node => {
                    this.groupRef = node;
                  }}
                  dragBoundFunc={pos => {
                    console.log("POS", pos, this.groupRef, this.SourceImageRef);
                    return pos;
                    // var newY = pos.y < 50 ? 50 : pos.y;
                    // return {
                    //   x: pos.x,
                    //   y: newY
                    // };
                    //  console.log("POS", pos);
                    // var x = stage.width() / 2;
                    // var y = 70;
                    // var radius = 50;
                    // var scale =
                    //   radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                    // if (scale < 1)
                    //   return {
                    //     y: Math.round((pos.y - y) * scale + y),
                    //     x: Math.round((pos.x - x) * scale + x)
                    //   };
                    // else return pos;
                  }}
                >
                  {this.props.imageObject && (
                    <SourceImage
                      ref={node => {
                        this.SourceImageRef = node;
                      }}
                      width={this.state.imageWidth}
                      height={this.state.imageHeight}
                      // canvasWidth={this.state.width}
                      // canvasHeight={(window.innerHeight * 70) / 100}
                      sourceImageObject={this.props.imageObject}
                      // dragComplete={(updated_x_pos, updated_y_pos) => {
                      //   this.setState({
                      //     x_pos: updated_x_pos,
                      //     y_pos: updated_y_pos,
                      //     konvaImageList: this.state.konvaImageList.map(img => {
                      //       return Object.assign(img, {
                      //         x: +(img.x + (updated_x_pos - x_pos)).toFixed(2),
                      //         y: +(img.y + (updated_y_pos - y_pos)).toFixed(2)
                      //       });
                      //     })
                      //   });
                      // }}
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

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "baseline",
              margin: "10px 0 10px 0",
              width: "100%",
              position: "absolute",
              bottom: 0
            }}
          >
            <div
              style={{
                padding: "6px 8px",
                background: "#ffffff17",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <ImageIcon style={{ fontSize: "18px", color: "grey" }} />
                <input
                  name="scale"
                  type="range"
                  onChange={this.handleScale}
                  min="1"
                  max="2"
                  step="0.01"
                  defaultValue="1"
                  style={{ margin: "0 5px 0 5px", cursor: "grabbing" }}
                />
                <ImageIcon style={{ fontSize: "30px", color: "grey" }} />
              </div>

              <span
                style={{ marginLeft: "4px", display: "flex" }}
                onClick={this.rotate}
              >
                <RotateIcon style={{ fontSize: "30px", color: "grey" }} />
              </span>
            </div>
          </div>
        </div>
        <div className="avatar-style-vectors">
          <div className="content" style={{ margin: "30px 0" }}>
            <Sticker id="1" name={`${Date.now()}str1`} src="test_mask_1.png" />
            <Sticker id="2" name={`${Date.now()}str2`} src="test_mask_2.png" />
          </div>
          <span
            style={{
              display: "flex",
              flex: "1"
            }}
            onClick={this.removeSelectedSticker}
          >
            {selectedShapeName && (
              <DeleteIcon
                style={{ fontSize: "50px", color: "red", margin: "10px" }}
              />
            )}
          </span>
        </div>
        <span
          style={{ marginBottom: 5 }}
          onClick={this.handleExportClick}
          className="greenButton"
        >
          {!uploading ? t("Save") : t("Uploading")}
        </span>
      </div>
    );
  }
}

export default EditCanvasImage;
