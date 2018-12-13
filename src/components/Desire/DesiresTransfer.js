import React, { Component } from "react";
import { Transfer } from "antd";

import { desireOptions } from "../../docs/data";
class DesiresTransfer extends Component {
  state = {
    desires: [],
    targetKeys: []
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { chosen } = this.props;

    const targetKeys = [];
    const desires = [];
    desireOptions.forEach(desire => {
      const data = {
        key: desire.value.toString(),
        title: desire.label,
        chosen: chosen.indexOf(desire.value) > -1
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      desires.push(data);

      this.setState({ desires, targetKeys });
    });
  };

  filterOption = (inputValue, option) => {
    return option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
  };

  handleChange = targetKeys => {
    this.setState({ targetKeys });
    this.props.selectDesires(targetKeys);
  };

  handleSearch = (dir, value) => {
    console.log("search:", dir, value);
  };

  render() {
    return (
      <Transfer
        dataSource={this.state.desires}
        titles={["All", "Mine"]}
        showSearch
        filterOption={this.filterOption}
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        render={item => item.title}
      />
    );
  }
}

export default DesiresTransfer;
