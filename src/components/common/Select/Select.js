import React from "react";
import PropTypes from "prop-types";
import "./Select.css";

class Select extends React.Component {
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
    this.selectContainerRef = React.createRef();
  }

  state = {
    menuOpen: false,
    selectedOption: this.props.options[0],
    selectListOffsetTop: 0,
    selectedOptions: [this.props.options[0]]
  };

  componentDidMount() {
    this.getDefaultOption();
    document.addEventListener("mousedown", this.handleClickOutside);
    this.setState({
      selectListOffsetTop: this.selectContainerRef.current.offsetTop + 48
    });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    // console.log(event);
    //TODO: Fix handle clickout for this
    // if (
    //   this.selectContainerRef &&
    //   !this.selectContainerRef.current.contains(event.target) &&
    //   this.state.menuOpen
    // ) {
    //   this.setState({ menuOpen: false });
    // }
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
        if (found == undefined)
          throw "The default value you passed as props can not found in select options array";
        return found;
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
        selectedOptionsCopy.push(optionProps);
      }

      this.setState(
        { selectedOptions: selectedOptionsCopy, menuOpen: true },
        () => {
          if (onChange) onChange(this.state.selectedOptions, event);
        }
      );
    }
  };

  render() {
    const {
      selectListOffsetTop,
      selectedOptions,
      selectedOption,
      menuOpen
    } = this.state;
    const { className, label, multiple, options } = this.props;
    const SelectList = () => (
      <div className="select-list" style={{ top: selectListOffsetTop + "px" }}>
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
                key={i}
                onClick={e => this.onSelect(e, d)}
                className={checked ? "checked" : ""}
              >
                {d.label}
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <React.Fragment>
        <div
          ref={this.selectContainerRef}
          className={"select-container " + className || ""}
          onClick={() => this.setState({ menuOpen: !menuOpen })}
        >
          <label>{label}</label>
          {multiple && (
            <div className="multiple-options">
              {selectedOptions.map((d, idx, arr) => {
                if (idx === arr.length - 1) {
                  return <span key={d.label}>{d.label}</span>;
                }
                return <span key={d.label}>{d.label + ","}</span>;
              })}
            </div>
          )}
          {!multiple && <span>{selectedOption.label}</span>}
        </div>
        {menuOpen && <SelectList />}
      </React.Fragment>
    );
  }
}

export default Select;
