import React, { Component } from "react";
import "antd/dist/antd.css";
import { Select } from "antd";

const Option = Select.Option;

class MultiSelectDropdown extends Component {
  render() {
    const { placeholder, options, style } = this.props;
    return (
      <Select mode="multiple" style={style} placeholder={placeholder}>
        {options.map(option => (
          <Option key={option.value}>{option.label}</Option>
        ))}
      </Select>
    );
  }
}

export default MultiSelectDropdown;
