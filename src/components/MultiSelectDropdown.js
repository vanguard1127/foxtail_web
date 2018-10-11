import React, { Component } from "react";
import "antd/dist/antd.css";
import { Select } from "antd";

const Option = Select.Option;

class MultiSelectDropdown extends Component {
  render() {
    const {
      handleChange,
      placeholder,
      name,
      defaultValue,
      options,
      style
    } = this.props;
    return (
      <Select
        mode="multiple"
        style={{ ...style }}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={handleChange}
      >
        {options.map(option => (
          <Option name={name} key={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    );
  }
}

export default MultiSelectDropdown;
