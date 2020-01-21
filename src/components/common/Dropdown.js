import React, { Component } from "react";
import Select from "./Select";
import { catchErrors } from "../common/ErrorHandler";

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
    const availableLangs = process.env.REACT_APP_AVAIL_LANGUAGES_LIST.split(
      ","
    );
    if (availableLangs.indexOf(lang) < 0) {
      lang = "en";
    }

    import("../../docs/options/" + lang)
      .then(dictionary => {
        let options;
        if (this.props.type === "sex") {
          options = dictionary.sexSingleOptions;
        } else if (this.props.type === "lang") {
          options = dictionary.langOptions;
        } else if (this.props.type === "sexuality") {
          options = dictionary.sexualityOptions;
        } else if (this.props.type === "eventType") {
          options = dictionary.eventTypeOptions;
        } else if (this.props.type === "payType") {
          options = dictionary.payTypeOptions;
        } else {
          options = dictionary.sexOptions;
        }
        if (this.mounted) {
          this.setState({ options, isLoading: false });
        }
      })
      .catch(error => {
        catchErrors(error); /* Error handling */
      });
  };

  render() {
    const {
      onChange,
      onClose,
      value,
      placeholder,
      type,
      className
    } = this.props;
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
          className={className ? className : ""}
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
          className={className ? className : ""}
        />
      );
    }
  }
}

export default Dropdown;
