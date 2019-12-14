import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
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
    this.scrollPosition = 0;
  }

  state = {
    menuOpen: false,
    selectedOption: this.props.defaultOptionValue,
    selectedOptions: this.props.defaultOptionValues
  };

  UNSAFE_componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
    document.addEventListener("touchstart", this.handleClickOutside, false);
  }

  UNSAFE_componentWillUpdate(prevProps, prevState) {
    if (this.listContainerRef) {
      this.scrollPosition = this.listContainerRef.scrollTop;
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (this.listContainerRef) {
      this.listContainerRef.scrollTop = this.scrollPosition;
    }
  }

  componentDidMount() {
    this.mounted = true;
    if (this.props.defaultOptionValue) {
      this.setState({
        selectedOption: this.props.options.find(
          x => x.value == this.props.defaultOptionValue
        )
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener("mousedown", this.handleClickOutside, false);
    document.removeEventListener("touchstart", this.handleClickOutside, false);
  }

  handleClickOutside = event => {
    if (this.state.menuOpen) {
      if (!this.selectContainerRef.contains(event.target)) {
        if (this.mounted) {
          this.setState({ menuOpen: false }, () => {
            if (this.props.onClose) this.props.onClose();
          });
        }
      }
    }
  };

  onSelect = (event, optionProps) => {
    const { multiple, onChange } = this.props;
    if (!multiple) {
      if (this.mounted) {
        this.setState({ selectedOption: optionProps, menuOpen: false }, () => {
          if (onChange) onChange(optionProps, event);
        });
      }
    } else {
      let selectedOptionsCopy = [...this.state.selectedOptions];

      let isOptionExists =
        selectedOptionsCopy.find(x => x.value === optionProps.value) !==
        undefined;

      if (isOptionExists) {
        selectedOptionsCopy = selectedOptionsCopy.filter(
          x => x.value !== optionProps.value
        );
      } else {
        selectedOptionsCopy = [...selectedOptionsCopy, optionProps];
      }
      if (this.mounted) {
        this.setState(
          { selectedOptions: selectedOptionsCopy, menuOpen: true },
          () => {
            if (onChange) onChange(this.state.selectedOptions, event);
          }
        );
      }
    }
    this.setState({ menuOpen: false });
  };

  toggleDropdown = e => {
    if (this.props.multiple && e.target.tagName === "LI") {
      this.setState({ menuOpen: true });
      return;
    }
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  render() {
    const { selectedOptions, selectedOption, menuOpen } = this.state;
    const { className, label, multiple, options, t } = this.props;
    const optionCounter = selectedOptions ? selectedOptions.length : 0;

    const SelectList = () => (
      <div className={multiple ? "select-list multiple" : "select-list"}>
        <ul
          ref={listContainerRef => (this.listContainerRef = listContainerRef)}
        >
          {options.map((d, i) => {
            let checked = false;
            if (multiple) {
              checked =
                selectedOptions.find(x => x.value == d.value) != undefined;
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
          className={`select-container ${className} ${menuOpen ? "open" : ""}`}
          onClick={this.toggleDropdown}
          ref={selectContainerRef =>
            (this.selectContainerRef = selectContainerRef)
          }
        >
          <label>{label}</label>
          {multiple && (
            <div className="multiple-options">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((d, idx, arr) => {
                  if (idx === arr.length - 1) {
                    return <span key={Math.random()}>{t(d.label)}</span>;
                  }
                  return <span key={Math.random()}>{t(d.label) + ","}</span>;
                })
              ) : (
                <span key={Math.random()}>{""}</span>
              )}
            </div>
          )}
          {multiple && optionCounter > 0 && (
            <span className="option-counter">{`(${optionCounter})`}</span>
          )}
          {!multiple && selectedOption && <span>{selectedOption.label}</span>}

          {menuOpen && <SelectList />}
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation("common")(Select);
