import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import EmailPhoneResetBtn from './EmailPhoneResetBtn';
import ResetPhoneButton from './ResetPhoneButton';
import Select from './Select';
import { countryCodeOptions } from '../../../docs/options';

class ResetPhone extends Component {
  state = { text: '', code: '+1' };
  handleTextChange = event => {
    this.setState({ text: event.target.value.replace(/\D/g, '') });
  };

  handleChange = e => {
    this.setState({ code: e.value });
  };

  render() {
    const { close, t, ErrorBoundary, token, history } = this.props;
    const { code, text } = this.state;
    if (!token) {
      return (
        <section className="login-modal show">
          <div className="container">
            <div className="offset-md-3 col-md-6">
              <div className="popup">
                <span className="head">Reset Phone Login</span>
                <a className="close" onClick={() => close()} />
                <form>
                  <div className="form-content">
                    <span className="description">
                      Enter the last phone number you used to login.
                    </span>
                    <Select
                      onChange={this.handleChange}
                      defaultOptionValue={code}
                      options={countryCodeOptions}
                      className={'dropdown'}
                    />

                    <div className="phoneText input">
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        onChange={this.handleTextChange}
                        value={text}
                      />
                    </div>

                    <div className="submit">
                      <ErrorBoundary>
                        <EmailPhoneResetBtn
                          t={t}
                          phone={code + text}
                          close={close}
                        />
                      </ErrorBoundary>
                      <button className="border" onClick={() => close()}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return (
      <section className="login-modal show">
        <div className="container">
          <div className="offset-md-3 col-md-6">
            <div className="popup">
              <span className="head">Update Phone Login</span>
              <a className="close" onClick={() => close()} />
              <form>
                <div className="form-content">
                  <div className="submit">
                    <ErrorBoundary>
                      <ResetPhoneButton token={token} t={t} history={history} />
                    </ErrorBoundary>
                    <button className="border" onClick={() => close()}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default withNamespaces('modals')(ResetPhone);
