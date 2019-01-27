import React from "react";
import AvatarEditor from "react-avatar-editor";
import PropTypes from "prop-types";
import { Layer, Stage, Portal } from "react-konva";

class MyEditor extends React.Component {
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
        const { signedRequest, key, url } = data.signS3;

        await uploadToS3(file.filebody, signedRequest);

        await handlePhotoListChange({ file, key, url });
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
      x = (x + width) / 2 - 50;
      y = (y + height) / 2 - 50;

      const imgList = [...this.state.konvaImageList];
      imgList.push({ id, name, src, x, y });
      this.setState({ konvaImageList: imgList });
    } else {
      //calculations
      x = (x + nwidth) / 2 - 50 + this.state.lastCrop.x[0];
      y = (y + nheight) / 2 - 50 + this.state.lastCrop.y[0];

      const imgList = [...this.state.konvaImageList];
      imgList.push({ id, name, src, x, y });
      this.setState({ konvaImageList: imgList });
    }
  };

  removeSelectedSticker = () => {
    const filteredList = this.state.konvaImageList.filter(
      x => x.name !== this.state.selectedShapeName
    );
    this.setState({ konvaImageList: filteredList });
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
      uploading,
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
      <div style={{ width: "fit-content" }}>
        <div style={{ width, height, margin: "0 auto 6vh" }}>
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
              <Portal>
                <AvatarEditor
                  image={this.props.imageObject}
                  width={width - 50}
                  height={height - 50}
                  border={50}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={1.2}
                  rotate={rotation}
                />
              </Portal>
            </Layer>
          </Stage>
        </div>

        <div style={{ display: "inline" }}>
          <button style={{ marginBottom: 5 }} onClick={this.onStartCrop}>
            {t("Crop")}
          </button>
        </div>

        <button style={{ marginBottom: 5 }} onClick={this.rotate}>
          Rotate
        </button>

        <button
          style={{ marginBottom: 5 }}
          onClick={this.handleExportClick}
          disabled={uploading}
        >
          {t("Upload")}
        </button>
        <button style={{ marginBottom: 5 }} onClick={() => this.props.close()}>
          {t("Close")}
        </button>
        <button
          style={{ marginBottom: 5 }}
          onClick={this.removeSelectedSticker}
        >
          {t("removesticker")}
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

export default MyEditor;