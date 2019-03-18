import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { desireOptions } from '../../../docs/options';
import SearchBox from './SearchBox';
class Desires extends Component {
  state = { searchText: '' };
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.wrapperRef && this.wrapperRef.current === event.target) {
      this.props.close();
    }
  };
  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.searchText !== nextState.searchText ||
      this.props.desires !== nextProps.desires
    ) {
      return true;
    }
    return false;
  }
  render() {
    const { searchText } = this.state;
    const { close, onChange, desires, t, ErrorBoundary } = this.props;

    return (
      <section className="desires-popup show" ref={this.wrapperRef}>
        <div className="modal-popup desires-select">
          <ErrorBoundary>
            <div className="m-head">
              <span className="heading">{t('desireselect')}</span>
              <span className="title">{t('setdesires')}</span>
              <span className="close" onClick={close} />
            </div>
            <div className="m-body desires">
              <SearchBox value={searchText} onChange={this.setValue} t={t} />
              <div className="desires-list-con">
                <ul>
                  {desireOptions
                    .filter(desire =>
                      desire.label.toLowerCase().startsWith(searchText)
                    )
                    .map(option => (
                      <li key={option.value}>
                        <div className="select-checkbox">
                          <input
                            type="checkbox"
                            id={option.value}
                            checked={
                              desires.indexOf(option.value) > -1 ? true : false
                            }
                            onChange={e =>
                              onChange({
                                checked: e.target.checked,
                                value: option.value
                              })
                            }
                          />
                          <label htmlFor={option.value}>
                            <span />
                            <b>{t(option.label)}</b>
                          </label>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '5px' }}>
              Scroll down for more
            </div>
          </ErrorBoundary>
        </div>
      </section>
    );
  }
}
export default withNamespaces('modals')(Desires);
