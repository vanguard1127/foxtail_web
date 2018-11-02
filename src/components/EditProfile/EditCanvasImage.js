import React from 'react';
import { Layer, Stage } from 'react-konva';
import TransformerHandler from './TransformerHandler';
import SourceImage from './SourceImage';
import KonvaImage from './KonvaImage';
import { connect } from 'react-redux';
import { Button } from 'antd';

class EditCanvasImage extends React.Component {
  state = {
    imageSrc: null,
    width: 400,
    height: 400,
    selectedShapeName: '',
    hideTransformer: false,
    konvaImageList: []
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
      this.downloadURI(dataURL, 'stage1.png');
    });
  };

  downloadURI(uri, name) {
    const link = window.document.createElement('a');
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

  handleStickerClick = (id, name) => {
    const idFound = this.state.konvaImageList.find(x => x.id === id);
    if (idFound === undefined) {
      const imgList = [...this.state.konvaImageList];
      imgList.push({ id, name });
      this.setState({ konvaImageList: imgList });
    }
  };

  removeSelectedSticker = () => {
    const filteredList = this.state.konvaImageList.filter(x => x.name !== this.state.selectedShapeName);
    this.setState({ konvaImageList: filteredList });
  };

  render() {
    const Sticker = (props) => (
      <div {...props}
           onClick={() => this.handleStickerClick(props.id, props.name)}
           style={{ padding: 5, height: '100%' }}>
        <img style={{ height: '100%' }} src="http://konvajs.github.io/assets/yoda.jpg"/>
      </div>
    );
    console.log('redux store', this.props.imageObject)
    return (
      <div style={{ width: 'fit-content' }}>
        <Button style={{ marginBottom: 5 }} onClick={this.handleExportClick}>Export stage</Button>
        <Button style={{ marginBottom: 5 }} onClick={this.removeSelectedSticker}>Remove Selected Sticker</Button>
        <Stage
          style={{ backgroundColor: 'gray' }}
          width={this.state.width}
          height={this.state.height}
          onClick={this.handleStageClick}
          ref={node => {
            this.stageRef = node;
          }}
        >
          <Layer>
            {this.props.imageObject &&
            <SourceImage width={400} height={400} sourceImageObject={this.props.imageObject}/>
            }
            {this.state.konvaImageList.length > 0 && this.state.konvaImageList.map(img =>
              <KonvaImage
                key={img.id}
                onDragStart={this.handleDragStart}
                width={100}
                height={100}
                name={img.name}
              />
            )}
            {this.state.hideTransformer === false && (
              <TransformerHandler
                selectedShapeName={this.state.selectedShapeName}
              />
            )}
          </Layer>
        </Stage>
        <div style={{
          display: 'flex',
          height: 70,
          width: this.state.width,
          border: '1px solid silver',
          marginTop: 5,
          overflowY: 'auto'
        }}>
          <Sticker id="1" name="stc1"/>
          <Sticker id="2" name="stc2"/>
          <Sticker id="3" name="stc3"/>
          <Sticker id="4" name="stc4"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    imageObject: state.profilePage.imageObject
  }
};

export default connect(mapStateToProps)(EditCanvasImage);
