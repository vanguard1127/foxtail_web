import React, { Component } from "react";
import "./Tooltip.css";

class Tooltip extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.placement !== nextProps.placement) {
      return true;
    }
    return false;
  }
  render() {
    const { placement, title, children } = this.props;
    return (
      <div className={`tooltip`}>
        {children}
        <span className={`tooltiptext ${`tooltiptext-${placement}`}`}>
          {title}
        </span>
      </div>
    );
  }
}

export default Tooltip;
