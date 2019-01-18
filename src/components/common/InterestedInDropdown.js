import React, { Component } from "react";
import Select from "./Select";

const availableLangs = ["en", "tu"];
class InterestedInDropdown extends Component {
  state = {
    sexOptions: null,
    isLoading: true,
    error: null,
    lang: this.props.lang
  };
  componentDidMount() {
    console.log("DIDMOUNT");
    this.fetchData(this.state.lang);
  }

  componentDidUpdate(prevProps) {
    if (this.props.lang !== prevProps.lang) {
      this.fetchData(this.props.lang);
    }
  }

  fetchData = langSel => {
    let lang = langSel;
    if (availableLangs.indexOf(lang) < 0) {
      lang = "en";
    }
    import("../../docs/options/" + lang).then(options =>
      this.setState({ sexOptions: options.sexOptions, isLoading: false })
    );
  };

  render() {
    const { onChange, value, placeholder } = this.props;
    const { sexOptions, isLoading } = this.state;

    console.log("dropdown", this.props.lang);
    if (isLoading || sexOptions === null) {
      return <div>Loading...</div>;
    }
    return (
      <Select
        onChange={onChange}
        multiple
        label={placeholder}
        defaultOptionValues={
          value && value.map(val => sexOptions.find(el => el.value === val))
        }
        options={sexOptions}
        className={"dropdown"}
      />
    );
  }
}

export default InterestedInDropdown;
