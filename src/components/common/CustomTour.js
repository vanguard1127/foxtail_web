import React from 'react';
import Tour from 'reactour';

const accentColor = '#5cb7b7';
const CustomTour = ({ isTourOpen, tourConfig, onTourClose }) => (
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
export default CustomTour;
