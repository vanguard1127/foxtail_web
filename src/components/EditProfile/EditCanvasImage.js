import React from "react";
import PropTypes from "prop-types";
import { Layer, Group, Stage, Rect } from "react-konva";
import TransformerHandler from "./TransformerHandler";
import SourceImage from "./SourceImage";
import KonvaImage from "./KonvaImage";
import { Image } from "react-konva";
import { WithCrop } from "./WithCrop";

class EditCanvasImage extends React.Component {
  constructor(props) {
    super(props);
    let width = 400;
    let height = 400;
    const initialCrop = {
      x: [0, width],
      y: [0, height]
    };
    this.state = {
      width: width,
      height: height,
      selectedShapeName: "",
      hideTransformer: false,
      konvaImageList: [],
      crop: initialCrop,
      lastCrop: initialCrop,
      isCropping: false,
      unduCrop: false,
      rotation: 0,
      uploading: false
    };
  }
  static propTypes = {
    imageObject: PropTypes.object
  };

  componentDidMount() {
    // let's go rotate image relative to it's center!
    // we need to set offset to define new "center" of image
    const image = this.stageRef;
    image.offsetX(image.width() / 2);
    image.offsetY(image.height() / 2);
    // when we are setting {x,y} properties we are setting position of top left corner of image.
    // but after applying offset when we are setting {x,y}
    // properties we are setting position of central point of image.
    // so we also need to move the image to see previous result
    image.x(image.x() + image.width() / 2);
    image.y(image.y() + image.height() / 2);
  }

  handleStageClick = e => {
    this.setState({
      selectedShapeName: e.target.name()
    });
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
    this.setState({ hideTransformer: true, uploading: true }, () => {
      const dataURL = this.stageRef
        .getStage()
        .toDataURL({ mimeType: "image/jpeg" });
      var blobData = this.dataURItoBlob(dataURL);
      var file = {
        filename: this.props.imageObject.name,
        filetype: "image/jpeg",
        filebody: blobData
      };

      this.handleUpload(file);
    });
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
        const { signedRequest, key } = data.signS3;
        await uploadToS3(file.filebody, signedRequest);

        await handlePhotoListChange({ file, key });
        close();
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  handleDragStart = e => {
    const shapeName = e.target.attrs.name;
    if (this.state.selectedShapeName !== shapeName) {
      this.setState({ selectedShapeName: shapeName });
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
      const idFound = this.state.konvaImageList.find(x => x.id === id);
      x = (x + width) / 2 - 50;
      y = (y + height) / 2 - 50;
      if (idFound === undefined) {
        const imgList = [...this.state.konvaImageList];
        imgList.push({ id, name, src, x, y });
        this.setState({ konvaImageList: imgList });
      }
    } else {
      //calculations
      x = (x + nwidth) / 2 - 50 + this.state.lastCrop.x[0];
      y = (y + nheight) / 2 - 50 + this.state.lastCrop.y[0];

      const idFound = this.state.konvaImageList.find(x => x.id === id);

      if (idFound === undefined) {
        const imgList = [...this.state.konvaImageList];
        imgList.push({ id, name, src, x, y });
        this.setState({ konvaImageList: imgList });
      }
    }
  };

  removeSelectedSticker = () => {
    const filteredList = this.state.konvaImageList.filter(
      x => x.name !== this.state.selectedShapeName
    );
    this.setState({ konvaImageList: filteredList });
  };

  // Crop Functions
  onAcceptCrop = e => {
    e.preventDefault();
    this.setState({
      isCropping: false,
      lastCrop: this.state.crop
    });
  };
  onCancelCrop = e => {
    e.preventDefault();
    // console.log("last", this.state.lastCrop);
    this.setState({
      isCropping: false,
      crop: this.state.lastCrop
    });
  };
  onStartCrop = e => {
    e.preventDefault();
    this.setState({
      isCropping: true
    });
  };
  onCropChange = (Xs, Ys) => {
    if (this.state.unduCrop === true) {
      this.setState({
        crop: { x: [0, 400], y: [0, 400] },
        lastCrop: { x: [0, 400], y: [0, 400] },
        unduCrop: false
      });
    } else {
      this.setState({
        crop: { x: Xs, y: Ys }
      });
    }
  };

  undoCrop = e => {
    e.preventDefault();
    this.setState({
      unduCrop: true,
      isCropping: true
    });
  };

  rotate = () => {
    this.setState({
      rotation: this.state.rotation + 90
    });
  };

  render() {
    const {
      konvaImageList,
      width,
      height,
      hideTransformer,
      selectedShapeName,
      isCropping,
      uploading
    } = this.state;

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
      <div style={{ width: "fit-content" }}>
        <div style={{ width, height, margin: "0 auto" }}>
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
              <WithCrop
                width={width}
                height={height}
                onChange={this.onCropChange}
                initialCrop={this.state.crop}
                isCropping={isCropping}
                keepAspectRatio
              >
                {this.props.imageObject && (
                  <SourceImage
                    width={width}
                    height={height}
                    sourceImageObject={this.props.imageObject}
                  />
                )}
                {konvaImageList.length > 0 &&
                  konvaImageList.map(img => (
                    <KonvaImage
                      src={img.src}
                      key={img.id}
                      onDragStart={this.handleDragStart}
                      width={100}
                      height={100}
                      name={img.name}
                      x={img.x}
                      y={img.y}
                    />
                  ))}
                {hideTransformer === false && (
                  <TransformerHandler selectedShapeName={selectedShapeName} />
                )}
              </WithCrop>
            </Layer>
          </Stage>
        </div>
        {!isCropping ? (
          <div style={{ display: "inline" }}>
            <button style={{ marginBottom: 5 }} onClick={this.onStartCrop}>
              CROP
            </button>
          </div>
        ) : (
          <React.Fragment>
            <button
              style={{
                border: "none",
                backgroundColor: "lightgreen",
                marginBottom: 5
              }}
              onClick={this.onAcceptCrop}
            >
              accept
            </button>
            <button
              style={{
                border: "none",
                backgroundColor: "lightcoral",
                marginBottom: 5
              }}
              onClick={this.onCancelCrop}
            >
              cancel
            </button>
          </React.Fragment>
        )}

        <button style={{ marginBottom: 5 }} onClick={this.rotate}>
          Rotate
        </button>

        <button
          style={{ marginBottom: 5 }}
          onClick={this.handleExportClick}
          disabled={uploading}
        >
          Upload
        </button>
        <button style={{ marginBottom: 5 }} onClick={() => this.props.close()}>
          Close
        </button>
        <button
          style={{ marginBottom: 5 }}
          onClick={this.removeSelectedSticker}
        >
          Remove Selected Sticker
        </button>
        <div
          style={{
            display: "flex",
            height: 70,
            width: width,
            border: "1px solid silver",
            marginTop: 5,
            overflowY: "auto"
          }}
        >
          <Sticker id="1" name="stc1" src="test_mask_1.png" />
          <Sticker id="2" name="stc2" src="test_mask_2.png" />
        </div>
      </div>
    );
  }
}

export default EditCanvasImage;
