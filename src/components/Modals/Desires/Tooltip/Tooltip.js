import React, { Component } from "react";
import "./Tooltip.css";

class Tooltip extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.placement !== nextProps.placement ||
      this.props.children !== nextProps.children
    ) {
      return true;
    }
    return false;
  }
  render() {
    const { placement, title, children } = this.props;
    return (
      <div className={`desire-tooltip`}>
        {children}
        <span className={`tooltiptext ${`tooltiptext-${placement}`}`}>
          {title}
        </span>
      </div>
    );
  }
}

export default Tooltip;
