import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import './Select.css';

class Select extends PureComponent {
  static propTypes = {
    multiple: PropTypes.bool,
    label: PropTypes.string,
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
    selectedOption: '',
    selectedOptions: []
  };

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentDidMount() {
    this.getDefaultOption();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
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
        if (found == undefined)
          throw 'The default value you passed as props can not found in select options array';
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
    this.setState({ menuOpen: false });
  };

  render() {
    const { selectedOption, menuOpen } = this.state;
    const { className, multiple, options, t } = this.props;
    const menuStatus = !menuOpen;

    const SelectList = () => (
      <div
        className="select-list-country"
        width={{ width: '333px !important' }}
      >
        <ul>
          {options.map((d, i) => {
            return (
              <li key={i} onClick={e => this.onSelect(e, d)}>
                {d.label}
                <span style={{ float: 'right' }}>{d.value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <React.Fragment>
        <div
          ref={selectContainerRef =>
            (this.selectContainerRef = selectContainerRef)
          }
        >
          <div
            className={'select-container ' + className || ''}
            onClick={() => this.setState({ menuOpen: menuStatus })}
          >
            <span>{t(selectedOption.value)}</span>
            {menuOpen && <SelectList />}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withNamespaces('common')(Select);
