import React, { Component } from "react";
import { desireOptions } from "../../../docs/data";

class Selector extends Component {
  render() {
    const { togglePopup, desires } = this.props;

    return (
      <span>
        <div
          className="select_desires desires_select_popup"
          onClick={() => togglePopup()}
        >
          <span className="head">Desires select:</span>
          <ul>
            {desires.map(desire => {
              const desireObj = desireOptions.find(el => el.value === desire);
              if (desireObj) return <li key={desire}>{desireObj.label}</li>;
            })}
          </ul>
        </div>
      </span>
    );
  }
}

export default Selector;
