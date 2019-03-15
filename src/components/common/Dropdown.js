import React, { Component } from 'react';
import Select from './Select';

const availableLangs = ['en', 'tu', 'de'];
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
    this.fetchData(this.props.lang);
  }

  componentDidUpdate(prevProps) {
    if (this.props.lang !== prevProps.lang) {
      this.fetchData(this.props.lang);
    }
  }

  componentWillUnmount() {
    //TODO: unmount dynamic import to prevent error
    //console.log("componentWillUnmount");
  }

  fetchData = langSel => {
    let lang = langSel;

    if (availableLangs.indexOf(lang) < 0) {
      lang = 'en';
    }
    import('../../docs/options/' + lang)
      .then(els => {
        let ops;
        if (this.props.type === 'gender') {
          ops = els.genderOptions;
        } else {
          ops = els.sexOptions;
        }

        this.setState({ options: ops, isLoading: false });
      })
      .catch(console.log('Lang file error'));
  };

  render() {
    const { onChange, value, placeholder, type } = this.props;
    const { options, isLoading } = this.state;
    let multiple = false;
    if (type === 'interestedIn') {
      multiple = true;
    }

    if (isLoading || options === null) {
      return <div>Loading...</div>;
    }
    return (
      <Select
        onChange={onChange}
        multiple={multiple}
        label={placeholder}
        defaultOptionValues={
          multiple && value
            ? value.map(val => options.find(el => el.value === val))
            : null
        }
        options={options}
        className={'dropdown'}
      />
    );
  }
}

export default Dropdown;
