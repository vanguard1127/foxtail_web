import React, { Component } from "react";
import { Select } from "antd";
import i18n from "../../../i18n";

const Option = Select.Option;
class LangDropdown extends Component {
  handleLangChange = value => {
    i18n.changeLanguage(value);
    this.props.onChange(value);
  };

  render() {
    const { value } = this.props;

    return (
      <Select
        style={{ width: 120 }}
        onChange={this.handleLangChange}
        value={value ? localStorage.getItem("i18nextLng") : "en"}
      >
        <Option value="en">English</Option>
        <Option value="de">German</Option>
      </Select>
    );
  }
}

export default LangDropdown;
