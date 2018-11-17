import React from "react";
import PropTypes from "prop-types";
import { Layer, Stage } from "react-konva";
import TransformerHandler from "./TransformerHandler";
import SourceImage from "./SourceImage";
import KonvaImage from "./KonvaImage";
import { Button, message } from "antd";

class EditCanvasImage extends React.Component {
  static propTypes = {
    imageObject: PropTypes.object
  };

  state = {
    width: 400,
    height: 400,
    selectedShapeName: "",
    hideTransformer: false,
    konvaImageList: []
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
    this.setState({ hideTransformer: true }, () => {
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
      fileList
    } = this.props;
    await setS3PhotoParams(file.filename, file.filetype);
    //format name on backend
    //filename: this.formatFilename(file.name),
    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key } = data.signS3;
        await uploadToS3(file.filebody, signedRequest);

        var foundIndex = fileList.findIndex(x => x.name === file.filename);
        fileList[foundIndex] = {
          uid: Date.now(),
          url: key
        };

        await handlePhotoListChange({ file, fileList });
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
        message.warn(
          "An error has occured. We will have it fixed soon. Thanks for your patience."
        );
      });
  };

  handleDragStart = e => {
    const shapeName = e.target.attrs.name;
    if (this.state.selectedShapeName !== shapeName) {
      this.setState({ selectedShapeName: shapeName });
    }
  };

  handleStickerClick = (id, name, src) => {
    const idFound = this.state.konvaImageList.find(x => x.id === id);
    if (idFound === undefined) {
      const imgList = [...this.state.konvaImageList];
      imgList.push({ id, name, src });
      this.setState({ konvaImageList: imgList });
    }
  };

  removeSelectedSticker = () => {
    const filteredList = this.state.konvaImageList.filter(
      x => x.name !== this.state.selectedShapeName
    );
    this.setState({ konvaImageList: filteredList });
  };

  render() {
    const {
      konvaImageList,
      width,
      height,
      hideTransformer,
      selectedShapeName
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
                width={400}
                height={400}
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
                />
              ))}
            {hideTransformer === false && (
              <TransformerHandler selectedShapeName={selectedShapeName} />
            )}
          </Layer>
        </Stage>
        <Button style={{ marginBottom: 5 }} onClick={this.handleExportClick}>
          Save
        </Button>
        <Button
          style={{ marginBottom: 5 }}
          onClick={this.removeSelectedSticker}
        >
          Remove Selected Sticker
        </Button>
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
