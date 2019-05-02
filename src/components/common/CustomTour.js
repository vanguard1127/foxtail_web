import React, { Component } from "react";
import Tour from "reactour";

const accentColor = "#CF003C";
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
    const { isTourOpen, tourConfig, onTourClose, goToStep } = this.props;
    return (
      <>
        <Tour
          onRequestClose={onTourClose}
          steps={tourConfig}
          isOpen={isTourOpen}
          maskClassName="mask"
          className="helper"
          rounded={5}
          accentColor={accentColor}
          goToStep={goToStep}
        />
      </>
    );
  }
}
export default CustomTour;
