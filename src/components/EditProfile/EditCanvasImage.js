import React from "react";
import { Stage, Layer } from "react-konva";
import TransformerHandler from "./TransformerHandler";
import SourceImage from "./SourceImage";
import KonvaImage from "./KonvaImage";
import smile from "./smile4.png";
import ProfilePic from "./profilepic.png";

class EditCanvasImage extends React.Component {
  state = {
    imageSrc: ProfilePic,
    width: 400,
    height: 400,
    selectedShapeName: "",
    hideTransformer: false
  };

  handleStageClick = e => {
    this.setState({
      selectedShapeName: e.target.name()
    });
  };
  handleExportClick = () => {
    /*this.setState(
      {
        width: this.props.store.imageWidth,
        height: this.props.store.imageHeight
      },
      () => console.log(this.state)
    );*/
    this.setState({ hideTransformer: true }, () => {
      const dataURL = this.stageRef.getStage().toDataURL();
      this.downloadURI(dataURL, "stage1.png");
    });
  };
  downloadURI(uri, name) {
    const link = window.document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //delete link;
  }
  onFileChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      this.setState({ imageSrc: e.target.result });
    };

    reader.readAsDataURL(file);
  };

  handleDragStart = e => {
    const shapeName = e.target.attrs.name;
    if (this.state.selectedShapeName !== shapeName) {
      this.setState({ selectedShapeName: shapeName });
    }
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.onFileChange} />
        <button onClick={this.handleExportClick}>Export stage</button>
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
            {this.state.imageSrc !== null && (
              <SourceImage imageSrc={this.state.imageSrc} />
            )}
            <KonvaImage
              onDragStart={this.handleDragStart}
              width={100}
              height={100}
              name="smile"
              src={smile}
            />
            <KonvaImage
              onDragStart={this.handleDragStart}
              width={100}
              height={100}
              name="smile2"
              src={smile}
            />
            {this.state.hideTransformer === false && (
              <TransformerHandler
                selectedShapeName={this.state.selectedShapeName}
              />
            )}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default EditCanvasImage;
