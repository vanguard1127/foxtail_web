import React, { Component } from 'react';
import Tour from 'reactour';

const accentColor = '#5cb7b7';
class CustomTour extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.onTourClose !== nextProps.onTourClose ||
      this.props.isTourOpen !== nextProps.isTourOpen
    ) {
      return true;
    }
    return false;
  }
  render() {
    const { isTourOpen, tourConfig, onTourClose } = this.props;
    return (
      <div>
        <Tour
          onRequestClose={onTourClose}
          steps={tourConfig}
          isOpen={isTourOpen}
          maskClassName="mask"
          className="helper"
          rounded={5}
          accentColor={accentColor}
        />
      </div>
    );
  }
}
export default CustomTour;
