import React from "react";
import PropTypes from "prop-types";
import { Layer, Stage } from "react-konva";
import TransformerHandler from "./TransformerHandler";
import SourceImage from "./SourceImage";
import KonvaImage from "./KonvaImage";
import { Button } from "antd";

class EditCanvasImage extends React.Component {
  static propTypes = {
    imageObject: PropTypes.object
  };

  state = {
    imageSrc: null,
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
      uploadPhoto,
      setPhotoDetails,
      uploadToS3,
      fileList,
      setProfilePicDetails
    } = this.props;

    await setPhotoDetails(file.filename, file.filetype);
    //format name on backend
    //filename: this.formatFilename(file.name),
    await signS3().then(async ({ data }) => {
      const { signedRequest, key } = data.signS3;
      await uploadToS3(file.filebody, signedRequest);
      if (this.props.private) {
        await setProfilePicDetails({
          photoUrl: key,
          order: fileList.length + 3
        });
      } else {
        await setProfilePicDetails({
          photoUrl: key,
          order: fileList.length - 1
        });
      }

      try {
        await uploadPhoto().then(async ({ data }) => {
          this.setState({
            previewImage: "https://ft-img-bucket.s3.amazonaws.com/" + key,
            previewVisible: true
          });
          console.log("Response:", data);
        });
      } catch (e) {
        console.log("Error", e);
      }
    });
  };

  downloadURI(uri, name) {
    const link = window.document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
          width={this.state.width}
          height={this.state.height}
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
            {this.state.konvaImageList.length > 0 &&
              this.state.konvaImageList.map(img => (
                <KonvaImage
                  src={img.src}
                  key={img.id}
                  onDragStart={this.handleDragStart}
                  width={100}
                  height={100}
                  name={img.name}
                />
              ))}
            {this.state.hideTransformer === false && (
              <TransformerHandler
                selectedShapeName={this.state.selectedShapeName}
              />
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
            width: this.state.width,
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
