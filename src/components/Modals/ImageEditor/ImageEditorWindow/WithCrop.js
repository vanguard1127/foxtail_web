import React, { PureComponent } from 'react';
import { Rect, Circle, Group } from 'react-konva';

class WithAnchors extends PureComponent {
  static defaultProps = {
    x: 0,
    y: 0
  };
  constructor(props) {
    super(props);
    this.state = {
      handlesXs: [props.x, props.x + props.width],
      handlesYs: [props.y, props.y + props.height],
      activeAnchor: null,
      isDraggingBox: false,
      initialMouseOffset: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      if (
        this.props.initialCrop.x !== this.state.handlesXs ||
        this.props.initialCrop.y !== this.state.handlesYs
      ) {
        // console.log("new", this.props.initialCrop);
        this.setState({
          handlesXs: this.props.initialCrop.x,
          handlesYs: this.props.initialCrop.y
        });
      }
    }
  }
  // Indexes of state arrays
  getPositionIndexes = name => {
    if (name === 'topLeft') return { x: 0, y: 0 };
    if (name === 'topRight') return { x: 1, y: 0 };
    if (name === 'bottomLeft') return { x: 0, y: 1 };
    if (name === 'bottomRight') return { x: 1, y: 1 };
    return {};
  };
  limitX = newX =>
    Math.max(Math.min(this.props.x + this.props.width, newX), this.props.x);
  limitY = newY =>
    Math.max(Math.min(this.props.y + this.props.height, newY), this.props.y);
  setAnchorPosition = (name, { x, y }) => {
    const { handlesXs, handlesYs } = this.state;
    const { keepAspectRatio } = this.props;
    const { x: xIndex, y: yIndex } = this.getPositionIndexes(name);
    let anchorX = this.limitX(x);
    let anchorY = this.limitY(y);
    if (keepAspectRatio) {
      const handlesXsWithNewAnchor = handlesXs.slice();
      const handlesYsWithNewAnchor = handlesYs.slice();
      handlesXsWithNewAnchor[xIndex] = anchorX;
      handlesYsWithNewAnchor[yIndex] = anchorY;
      // asume 0, 0
      let width = handlesXsWithNewAnchor[1] - handlesXsWithNewAnchor[0];
      let height = handlesYsWithNewAnchor[1] - handlesYsWithNewAnchor[0];

      // Calculate ratio based in smallest value
      if (width < height) {
        height = (width * this.props.height) / this.props.width;
        if (yIndex === 0) {
          anchorY = handlesYs[1] - height;
        }
        if (yIndex === 1) {
          anchorY = height + handlesYs[0];
        }
      } else {
        width = (height * this.props.width) / this.props.height;
        if (xIndex === 0) {
          anchorX = handlesXs[1] - width;
        }
        if (xIndex === 1) {
          anchorX = width + handlesXs[0];
        }
      }
    }
    const newHandlesXs = handlesXs.map((currentX, i) =>
      i === xIndex ? anchorX : currentX
    );
    const newHandlexYs = handlesYs.map((currentY, i) =>
      i === yIndex ? anchorY : currentY
    );
    this.setState({
      handlesXs: newHandlesXs,
      handlesYs: newHandlexYs
    });
    if (this.props.onChange) {
      this.props.onChange(newHandlesXs, newHandlexYs);
    }
  };
  handleMouseMove = e => {
    const {
      activeAnchor,
      isDraggingBox,
      handlesXs,
      handlesYs,
      initialMouseOffset
    } = this.state;
    const { width, height } = this.props;
    if (activeAnchor) {
      this.setAnchorPosition(
        activeAnchor,
        e.currentTarget.getStage().getPointerPosition()
      );
    } else if (isDraggingBox) {
      const mouse = e.currentTarget.getStage().getPointerPosition();
      const cropBoxWidth = handlesXs[1] - handlesXs[0];
      const cropBoxHeight = handlesYs[1] - handlesYs[0];
      const offsetX = [
        initialMouseOffset.x,
        cropBoxWidth - initialMouseOffset.x
      ];
      const offsetY = [
        initialMouseOffset.y,
        cropBoxHeight - initialMouseOffset.y
      ];
      let newHandlesXs = [
        Math.max(0, Math.min(width - cropBoxWidth, mouse.x - offsetX[0])),
        Math.max(cropBoxWidth, Math.min(width, mouse.x + offsetX[1]))
      ];
      let newHandlexYs = [
        Math.max(0, Math.min(height - cropBoxHeight, mouse.y - offsetY[0])),
        Math.max(cropBoxHeight, Math.min(height, mouse.y + offsetY[1]))
      ];
      this.setState({
        handlesXs: newHandlesXs,
        handlesYs: newHandlexYs
      });
      if (this.props.onChange) {
        this.props.onChange(newHandlesXs, newHandlexYs);
      }
    }
  };
  resetActiveAnchor = () => {
    this.setState({
      activeAnchor: null,
      isDraggingBox: false
    });
  };
  handleAnchorMouseDown = name => {
    this.setState({
      activeAnchor: name
    });
  };
  onCropBoxMouseDown = e => {
    const { handlesXs, handlesYs } = this.state;
    const mouse = e.currentTarget.getStage().getPointerPosition();
    this.setState({
      isDraggingBox: true,
      initialMouseOffset: {
        x: mouse.x - handlesXs[0],
        y: mouse.y - handlesYs[0]
      },
      activeAnchor: null
    });
  };
  render() {
    const { handlesXs, handlesYs } = this.state;
    const { onDrag, mantainAspectRatio, children, show } = this.props;
    const anchorNames = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
    const x = handlesXs[0];
    const y = handlesYs[0];
    const width = handlesXs[1] - handlesXs[0];
    const height = handlesYs[1] - handlesYs[0];
    // console.log("using", handlesXs, handlesYs);
    // console.log("x", handlesXs, "y", handlesYs);

    // NOTE: send smallest X and smallest Y And abs(size)
    return (
      <React.Fragment>
        <Group
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.resetActiveAnchor}
          onMouseLeave={this.resetActiveAnchor}
        >
          {children(x, y, width, height)}
          {show ? (
            <Group>
              <Rect
                stroke={'#24242450'}
                x={x}
                y={y}
                width={width}
                height={height}
                onMouseDown={this.onCropBoxMouseDown}
              />
              {anchorNames.map((name, i) => {
                const positionIndexes = this.getPositionIndexes(name);
                // console.log(name, xpos, ypos);

                return (
                  <Circle
                    key={name + i}
                    onMouseDown={() => this.handleAnchorMouseDown(name)}
                    x={handlesXs[positionIndexes.x]}
                    y={handlesYs[positionIndexes.y]}
                    offsetX={0}
                    offsetY={0}
                    fill="red"
                    radius={8}
                    onDragMove={e => {
                      this.setAnchorPosition(name, e);
                    }}
                  />
                );
              })}
            </Group>
          ) : null}
        </Group>
      </React.Fragment>
    );
  }
}

export function WithCrop({ children, width, height, isCropping, ...props }) {
  return (
    <WithAnchors width={width} height={height} show={isCropping} {...props}>
      {(clipX, clipY, clipWidth, clipHeight) => {
        const scaleX = width / clipWidth;
        const scaleY = height / clipHeight;
        return (
          <Group
            x={isCropping ? 0 : -clipX * scaleX}
            y={isCropping ? 0 : -clipY * scaleY}
            width={width}
            height={height}
            scaleX={isCropping ? 1 : scaleX}
            scaleY={isCropping ? 1 : scaleY}
            clipX={isCropping ? 0 : clipX}
            clipY={isCropping ? 0 : clipY}
            clipWidth={isCropping ? width : clipWidth}
            clipHeight={isCropping ? height : clipHeight}
          >
            {children}
          </Group>
        );
      }}
    </WithAnchors>
  );
}
