import React, { PureComponent } from 'react';
import Tour from 'reactour';

const accentColor = '#5cb7b7';
class CustomTour extends PureComponent {
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
