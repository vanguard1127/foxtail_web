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
      imageHeight: 0
    };
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
    const height = width / 3;
    this.setState({ width, height });
    if (this.state.imageWidth == 0 || this.state.imageHeight == 0) {
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
            initImageHeight = initImageHeight / 1.1;
            initImageWidth = initImageWidth / 1.1;
          }
          const x_pos = (width - initImageWidth) / 2;
          const y_pos = (height - initImageHeight) / 2;
          this.setState({
            imageWidth: initImageWidth,
            imageHeight: initImageHeight,
            x_pos: x_pos + initImageWidth / 2,
            y_pos: y_pos + initImageHeight / 2
          });
        }.bind(this);
      };
    }
    if (this.state.x_pos == 0 || this.state.y_pos == 0) {
      return;
    }

    var x_pos = this.state.x_pos;
    var imageWidth = this.state.imageWidth;
    if (imageWidth * this.state.scale < width) {
      if (
        this.state.x_pos - imageWidth / 2 + imageWidth * this.state.scale >
        width
      ) {
        x_pos = width - imageWidth * this.state.scale + imageWidth / 2;
      } else {
      }
    } else {
      x_pos = width / 2;
      imageWidth = width / this.state.scale;
    }
    var y_pos = this.state.y_pos;
    var imageHeight = this.state.imageHeight;
    if (this.state.imageHeight * this.state.scale < height) {
      if (
        this.state.y_pos -
          imageHeight / 2 +
          this.state.imageHeight * this.state.scale >
        height
      ) {
        y_pos =
          height - this.state.imageHeight * this.state.scale + imageHeight / 2;
      } else {
      }
    } else {
      y_pos = height / 2;
      imageHeight = height / this.state.scale;
    }
    this.setState({
      width: width,
      height: height,
      x_pos: x_pos,
      y_pos: y_pos,
      imageWidth: imageWidth,
      imageHeight: imageHeight
    });
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
        const dataURL = this.stageRef.getStage().toDataURL({
          mimeType: "image/jpeg",
          x,
          y,
          width,
          height,
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
                  drapComplete={(x_pos, y_pos) => {
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
