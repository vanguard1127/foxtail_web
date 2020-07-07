// TODO NOT USED

import React, { memo } from "react";
import Tour from "reactour";

interface ICustomTourProps {
  isTourOpen,
  tourConfig,
  onTourClose,
  goToStep,
}

const CustomTour: React.FC<ICustomTourProps> = memo(({
  isTourOpen,
  tourConfig,
  onTourClose,
  goToStep
}) => (
    <Tour
      onRequestClose={onTourClose}
      steps={tourConfig}
      isOpen={isTourOpen}
      maskClassName="mask"
      className="helper"
      rounded={5}
      accentColor="#CF003C"
      goToStep={goToStep}
    />
  ));

export default CustomTour;
