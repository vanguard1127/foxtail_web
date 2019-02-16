import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { desireOptions } from '../../../docs/options';
import SearchBox from './SearchBox';
class Desires extends Component {
  state = { searchText: '' };
  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };
  render() {
    const { searchText } = this.state;
    const { closePopup, onChange, desires, t, ErrorBoundary } = this.props;

    return (
      <section className="desires-popup show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup desires-select">
                  <ErrorBoundary>
                    <div className="m-head">
                      <span className="heading">{t('desireselect')}</span>
                      <span className="title">{t('setdesires')}</span>
                      <span className="close" onClick={closePopup} />
                    </div>
                    <div className="m-body desires">
                      <SearchBox
                        value={searchText}
                        onChange={this.setValue}
                        t={t}
                      />
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
                                      desires.indexOf(option.value) > -1
                                        ? true
                                        : false
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
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default withNamespaces('modals')(Desires);
