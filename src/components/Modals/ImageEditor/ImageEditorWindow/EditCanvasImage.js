import React, { PureComponent } from "react";
import { Layer, Stage } from "react-konva";
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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.x_pos !== this.state.x_pos ||
      prevState.y_pos !== this.state.y_pos
    ) {
      const x_pos = this.state.x_pos - prevState.x_pos;
      const y_pos = this.state.y_pos - prevState.y_pos;

      this.setState({
        konvaImageList: this.state.konvaImageList.map(img => {
          return Object.assign(img, { x: img.x + x_pos, y: img.y + y_pos });
        })
      });
    }
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
        const x = this.state.x_pos - width / 2;
        const y = this.state.y_pos - height / 2;
        console.log(width, height);
        const dataURL = this.stageRef.getStage().toDataURL({
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
    let x = 0;
    let y = 0;
    let width = this.state.width;
    let height = this.state.height;

    let nwidth = this.state.width;
    let nheight = this.state.height;
    console.log("MOVE");
    if (nwidth === width && nheight === height) {
      x = (x + width) / 2 - 50;
      y = (y + height) / 2 - 50;

      let imgList = [...this.state.konvaImageList];
      imgList = [...imgList, { id, name, src, x, y }];
      if (this.mounted) {
        this.setState({ konvaImageList: imgList });
      }
    } else {
      // calculations
      x = (x + nwidth) / 2 - 50;
      y = (y + nheight) / 2 - 50;

      let imgList = [...this.state.konvaImageList];
      imgList = [...imgList, { id, name, src, x, y }];
      if (this.mounted) {
        this.setState({ konvaImageList: imgList });
      }
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
      this.setState({
        rotation: this.state.rotation + 90
      });
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
    console.log("Source X:", x_pos, " Y:", y_pos);
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{ display: "flex", justifyContent: "center" }}
          ref={node => {
            this.container = node;
          }}
        >
          <Stage
            style={{ backgroundColor: "#0e0d0dc7" }}
            width={width}
            height={height}
            onClick={this.handleStageClick}
            ref={node => {
              this.stageRef = node;
            }}
          >
            <Layer>
              {this.props.imageObject && (
                <SourceImage
                  ref={node => {
                    this.SourceImageRef = node;
                  }}
                  width={this.state.imageWidth * this.state.scale}
                  height={this.state.imageHeight * this.state.scale}
                  canvasWidth={this.state.width}
                  canvasHeight={this.state.height}
                  x_pos={x_pos}
                  y_pos={y_pos}
                  sourceImageObject={this.props.imageObject}
                  rotation={this.state.rotation}
                  dragComplete={(x_pos, y_pos) => {
                    this.setState({ x_pos, y_pos });
                  }}
                />
              )}
              {konvaImageList.length > 0 &&
                konvaImageList.map((img, idx) => {
                  // console.log(
                  //   "Image X:",
                  //   img.x,
                  //   "displace",
                  //   x_pos - init_x,
                  //   "Y:",
                  //   img.y,
                  //   "displace",
                  //   y_pos - init_y
                  // );
                  var x = (img.x + x_pos) / 2;
                  var y = (img.y + y_pos) / 2;

                  console.log("new x:", x, "y:", y);
                  return (
                    <KonvaImage
                      src={img.src}
                      key={img.id + idx}
                      onDragStart={this.handleDragStart}
                      width={100 * this.state.scale}
                      height={100 * this.state.scale}
                      name={img.name}
                      x={x}
                      y={y}
                      rotation={0}
                    />
                  );
                })}
              {hideTransformer === false && (
                <TransformerHandler selectedShapeName={selectedShapeName} />
              )}
            </Layer>
          </Stage>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "baseline",
            margin: "10px 0 10px 0"
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

          <span className="avatar-style-rotate" onClick={this.rotate}>
            <RotateIcon style={{ fontSize: "30px", color: "grey" }} />
          </span>
        </div>
        <div className="avatar-style-vectors">
          <div className="content">
            <Sticker id="1" name="stc1" src="test_mask_1.png" />
            <Sticker id="2" name="stc2" src="test_mask_2.png" />
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
