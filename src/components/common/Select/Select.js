import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import "./Select.css";

class Select extends PureComponent {
  static propTypes = {
    multiple: PropTypes.bool,
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    defaultOptionValue: PropTypes.string, // should pass the value prop's value
    defaultOptionValues: PropTypes.array,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  state = {
    menuOpen: false,
    selectedOption: "",
    selectedOptions: []
  };

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentDidMount() {
    this.getDefaultOption();
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside, false);
  }

  handleClickOutside = event => {
    if (!this.selectContainerRef.contains(event.target)) {
      this.setState({ menuOpen: false });
    }
  };

  getDefaultOption = () => {
    const {
      defaultOptionValues,
      multiple,
      defaultOptionValue,
      options
    } = this.props;

    if (multiple && defaultOptionValues) {
      const defaultOptions = defaultOptionValues.map(d => {
        const found = options.find(x => x.value == d.value);
        if (found == undefined) return found;
      });
      this.setState({ selectedOptions: defaultOptions });
    } else if (defaultOptionValue) {
      const foundOption = options.find(x => x.value == defaultOptionValue);
      if (foundOption) {
        this.setState({ selectedOption: foundOption });
      }
    }
  };

  onSelect = (event, optionProps) => {
    const { multiple, onChange } = this.props;
    if (!multiple) {
      this.setState({ selectedOption: optionProps, menuOpen: false }, () => {
        if (onChange) onChange(optionProps, event);
      });
    } else {
      let selectedOptionsCopy = [...this.state.selectedOptions];

      let isOptionExists =
        selectedOptionsCopy.find(x => x.value == optionProps.value) !=
        undefined;

      if (isOptionExists) {
        selectedOptionsCopy = selectedOptionsCopy.filter(
          x => x.value != optionProps.value
        );
      } else {
        selectedOptionsCopy = [...selectedOptionsCopy, optionProps];
      }

      this.setState(
        { selectedOptions: selectedOptionsCopy, menuOpen: true },
        () => {
          if (onChange) onChange(this.state.selectedOptions, event);
        }
      );
    }
    this.setState({ menuOpen: false });
  };

  render() {
    const { selectedOptions, selectedOption, menuOpen } = this.state;
    const { className, label, multiple, options, t } = this.props;
    const menuStatus = multiple ? true : !menuOpen;
    const optionCounter = selectedOptions.length;

    const SelectList = () => (
      <div className="select-list">
        <ul>
          {options.map((d, i) => {
            let checked = false;
            if (multiple) {
              checked =
                selectedOptions.find(x => x.value == d.value) != undefined;
            } else {
              checked = selectedOption.value == d.value;
            }
            return (
              <li
                key={Math.random()}
                onClick={e => this.onSelect(e, d)}
                className={checked ? "checked" : ""}
              >
                {t(d.label)}
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <React.Fragment>
        <div
          className={"select-container " + className || ""}
          onClick={() => this.setState({ menuOpen: menuStatus })}
          ref={selectContainerRef =>
            (this.selectContainerRef = selectContainerRef)
          }
        >
          <label>{label}</label>
          {multiple && (
            <div className="multiple-options">
              {selectedOptions.map((d, idx, arr) => {
                if (idx === arr.length - 1) {
                  return <span key={Math.random()}>{t(d.label)}</span>;
                }
                return <span key={Math.random()}>{t(d.label) + ","}</span>;
              })}
            </div>
          )}
          {!multiple && <span>{t(selectedOption.label)}</span>}
          {multiple && optionCounter > 0 && (
            <span className="option-counter">{`(${optionCounter})`}</span>
          )}
          {menuOpen && <SelectList />}
        </div>
      </React.Fragment>
    );
  }
}

export default withNamespaces("common")(Select);
