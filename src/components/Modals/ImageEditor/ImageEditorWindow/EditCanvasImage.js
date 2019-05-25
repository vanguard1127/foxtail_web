import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Layer, Stage } from "react-konva";
import TransformerHandler from "./TransformerHandler";
import SourceImage from "./SourceImage";
import KonvaImage from "./KonvaImage";
import RotateIcon from "@material-ui/icons/RotateRight";
import ImageIcon from "@material-ui/icons/Image";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import Konva from "konva";

class EditCanvasImage extends PureComponent {
  constructor(props) {
    super(props);
    let width = window.screen.width > 375 ? 1080 : 200;
    let height = window.screen.height > 668 ? 400 : 200;
    const initialCrop = {
      x: [0, width],
      y: [0, height]
    };
    this.state = {
      width: width,
      height: height,
      scaleWidth: 600,
      scaleHeight: 600,
      x_pos: width / 4,
      y_pos: height / 4,
      selectedShapeName: "",
      hideTransformer: false,
      konvaImageList: [],
      crop: initialCrop,
      lastCrop: initialCrop,
      isCropping: false,
      unduCrop: false,
      rotation: 0,
      uploading: false,
      scale: 1,
      imageWidth: 0,
      imageHeight: 0
    };
  }
  //   static propTypes = {
  //     imageObject: PropTypes.object
  //   };

  componentWillMount() {
    const reader = new FileReader();
    reader.readAsDataURL(this.props.imageObject);
    reader.onload = e => {
      const imageBase64 = e.target.result;
      const image = new window.Image();
      image.src = imageBase64;
      image.onload = function() {
        var initImageWidth = image.width;
        var initImageHeight = image.height;
        var { width, height } = this.props;
        if (width === 0 || width === undefined) {
          width = window.screen.width > 375 ? 1080 : 200;
        }
        if (height === 0 || height === undefined) {
          height = window.screen.height > 668 ? 400 : 200;
        }
        while (
          initImageHeight > height ||
          initImageHeight > width ||
          initImageWidth > width ||
          initImageWidth > height
        ) {
          initImageHeight = initImageHeight / 2;
          initImageWidth = initImageWidth / 2;
        }
        const x_pos = (width - initImageWidth) / 2;
        const y_pos = (height - initImageHeight) / 2;
        this.setState({
          width: width,
          height: height,
          imageWidth: initImageWidth,
          imageHeight: initImageHeight,
          x_pos: x_pos,
          y_pos: y_pos
        });
      }.bind(this);
    };
  }

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
    if (this.mounted && !this.state.uploading) {
      this.setState({ hideTransformer: true, uploading: true }, () => {
        const dataURL = this.stageRef.getStage().toDataURL({
          mimeType: "image/jpeg",
          x: this.state.x_pos,
          y: this.state.y_pos,
          width: this.state.imageWidth * this.state.scale,
          height: this.state.imageHeight * this.state.scale,
          quality: 1
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
    //format name on backend
    //filename: this.formatFilename(file.name),
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

    let nwidth = this.state.lastCrop.x[1] - this.state.lastCrop.x[0];
    let nheight = this.state.lastCrop.y[1] - this.state.lastCrop.y[0];

    if (nwidth === width && nheight === height) {
      x = (x + width) / 2 - 50;
      y = (y + height) / 2 - 50;

      let imgList = [...this.state.konvaImageList];
      imgList = [...imgList, { id, name, src, x, y }];
      if (this.mounted) {
        this.setState({ konvaImageList: imgList });
      }
    } else {
      //calculations
      x = (x + nwidth) / 2 - 50 + this.state.lastCrop.x[0];
      y = (y + nheight) / 2 - 50 + this.state.lastCrop.y[0];

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
      const width = this.state.imageWidth * scale;
      const height = this.state.imageHeight * scale;
      const prev_width = this.state.imageWidth * this.state.scale;
      const prev_height = this.state.imageHeight * this.state.scale;
      var x_pos = this.state.x_pos;
      var y_pos = this.state.y_pos;
      x_pos = x_pos - (width - prev_width) / 2;
      y_pos = y_pos - (height - prev_height) / 2;
      this.setState({
        scale: scale,
        x_pos: x_pos,
        y_pos: y_pos
      });
    }
  };

  componentDidMount() {
    this.mounted = true;
    this.checkSize();
    // here we should add listener for "container" resize
    // take a look here https://developers.google.com/web/updates/2016/10/resizeobserver
    // for simplicity I will just listen window resize
    window.addEventListener("resize", this.checkSize);
    const image = this.stageRef;
    // console.log('image offsetX:', image.offsetX())
    // console.log('image offsetY:', image.offsetY())
    // console.log('image X:', image.x())
    // console.log('image Y:', image.y())
    image.offsetX(image.width() / 2);
    image.offsetY(image.height() / 2);

    // when we are setting {x,y} properties we are setting position of top left corner of image.
    // but after applying offset when we are setting {x,y}
    // properties we are setting position of central point of image.
    // so we also need to move the image to see previous result
    image.x(image.x() + image.width() / 2);
    image.y(image.y() + image.height() / 2);
    // console.log('image offsetX:', image.offsetX())
    // console.log('image offsetY:', image.offsetY())
    // console.log('image X:', image.x())
    // console.log('image Y:', image.y())
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener("resize", this.checkSize);
  }

  checkSize = () => {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    var x_pos = this.state.x_pos;
    if (this.state.imageWidth * this.state.scale < width) {
      if (this.state.x_pos + this.state.imageWidth * this.state.scale > width) {
        x_pos = width - this.state.imageWidth * this.state.scale;
      } else {
      }
    } else {
      x_pos = 0;
      this.state.imageWidth = width / this.state.scale;
    }
    var x_pos = this.state.x_pos;
    var imageWidth = this.state.imageWidth;
    if (this.state.imageWidth * this.state.scale < width) {
      if (this.state.x_pos + this.state.imageWidth * this.state.scale > width) {
        x_pos = width - this.state.imageWidth * this.state.scale;
      } else {
      }
    } else {
      x_pos = 0;
      imageWidth = width / this.state.scale;
    }
    var y_pos = this.state.y_pos;
    var imageHeight = this.state.imageHeight;
    if (this.state.imageHeight * this.state.scale < height) {
      if (
        this.state.y_pos + this.state.imageHeight * this.state.scale >
        height
      ) {
        y_pos = height - this.state.imageHeight * this.state.scale;
      } else {
      }
    } else {
      x_pos = 0;
      imageWidth = width / this.state.scale;
    }
    this.setState({
      width: width,
      height: height,
      x_pos: x_pos,
      y_pos: y_pos,
      imageHeight: imageHeight,
      imageWidth: imageWidth
    });
  };

  render() {
    const {
      konvaImageList,
      width,
      height,
      scaleWidth,
      scaleHeight,
      scale,
      x_pos,
      y_pos,
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
        <div
          style={{ display: "flex", justifyContent: "center" }}
          ref={node => {
            this.container = node;
          }}
        >
          <Stage
            style={{ backgroundColor: "gray" }}
            width={width}
            height={height}
            onClick={this.handleStageClick}
            ref={node => {
              this.stageRef = node;
            }}
            rotation={this.state.rotation}
          >
            <Layer>
              {this.props.imageObject && (
                <SourceImage
                  width={this.state.imageWidth * this.state.scale}
                  height={this.state.imageHeight * this.state.scale}
                  canvasWidth={this.state.width}
                  canvasHeight={this.state.height}
                  x_pos={x_pos}
                  y_pos={y_pos}
                  sourceImageObject={this.props.imageObject}
                  drapComplete={(x_pos, y_pos) => {
                    const oldX_pos = this.state.x_pos;
                    const oldY_pos = this.state.y_pos;
                    this.stageRef.x(this.stageRef.x() - oldX_pos + x_pos);
                    this.stageRef.y(this.stageRef.y() - oldY_pos + y_pos);
                    this.stageRef.offsetX(
                      this.stageRef.offsetX() - oldX_pos + x_pos
                    );
                    this.stageRef.offsetY(
                      this.stageRef.offsetY() - oldY_pos + y_pos
                    );
                    this.setState({ x_pos: x_pos, y_pos: y_pos });
                  }}
                />
              )}
              {konvaImageList.length > 0 &&
                konvaImageList.map((img, idx) => (
                  <KonvaImage
                    src={img.src}
                    key={img.id + idx}
                    onDragStart={this.handleDragStart}
                    width={100}
                    height={100}
                    name={img.name}
                    x={img.x}
                    y={img.y}
                    rotation={0}
                  />
                ))}
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
