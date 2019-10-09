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
      <div className={`tooltip tooltiptext ${`tooltiptext-${placement}`}`}>
        {children}
        <span className="tooltiptext">{title}</span>
      </div>
    );
  }
}

export default Tooltip;
