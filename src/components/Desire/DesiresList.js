import React, { Component } from "react";

class DesiresList extends Component {
  state = {};
  render() {
    const { desires } = this.props;
    return (
      <div>
        <ul
          style={{
            listStyleType: "none",
            margin: 0,
            padding: 0,
            overflow: "hidden"
          }}
        >
          {desires.map(desire => (
            <li
              key={desire}
              style={{
                float: "left",
                padding: "10px",
                margin: "5px",
                border: "2px solid #444",
                borderRadius: "5px"
              }}
            >
              {desire}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default DesiresList;
