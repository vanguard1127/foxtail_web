import React, { Component } from "react";
import Select from "./Select";
import { availableLangs } from "../../docs/consts";

class Dropdown extends Component {
  state = {
    options: null,
    isLoading: true,
    error: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.value !== nextProps.value ||
      nextState.isLoading !== this.state.isLoading
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.mounted = true;
    this.fetchData(this.props.lang);
  }

  componentDidUpdate(prevProps) {
    if (this.props.lang !== prevProps.lang) {
      this.fetchData(this.props.lang);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchData = langSel => {
    let lang = langSel;

    if (availableLangs.indexOf(lang) < 0) {
      lang = "en";
    }

    import("../../docs/options/" + lang)
      .then(els => {
        let ops;
        if (this.props.type === "gender") {
          ops = els.genderOptions;
        } else if (this.props.type === "lang") {
          ops = els.langOptions;
        } else if (this.props.type === "sexuality") {
          ops = els.sexualityOptions;
        } else if (this.props.type === "eventType") {
          ops = els.eventTypeOptions;
        } else {
          ops = els.sexOptions;
        }
        if (this.mounted) {
          this.setState({ options: ops, isLoading: false });
        }
      })
      .catch(error => {
        const ErrorHandler = require("../common/ErrorHandler");
        ErrorHandler.catchErrors(error); /* Error handling */
      });
  };

  render() {
    const { onChange, onClose, value, placeholder, type, noClass } = this.props;
    const { options, isLoading } = this.state;
    let multiple = false;
    if (type === "interestedIn") {
      multiple = true;
    }

    if (isLoading || options === null) {
      return <div>Loading...</div>;
    }

    if (multiple) {
      return (
        <Select
          onChange={onChange}
          onClose={onClose}
          multiple={multiple}
          label={placeholder}
          defaultOptionValues={
            value
              ? value.map(val => options.find(el => el.value === val))
              : null
          }
          options={options}
          className={noClass ? "" : "dropdown wide"}
        />
      );
    } else {
      return (
        <Select
          onChange={onChange}
          onClose={onClose}
          multiple={multiple}
          label={placeholder}
          defaultOptionValue={value}
          options={options}
          className={noClass ? "" : "dropdown wide"}
        />
      );
    }
  }
}

export default Dropdown;
