import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { toast } from 'react-toastify';

class Dialog extends Component {
  state = { text: '', errors: {} };

  handleTextChange = event => {
    this.setState({ text: event.target.value });
  };

  successMsg = msg => {
    toast.success(msg);
  };

  validateForm = async () => {
    try {
      await this.props.schema.validate(
        { text: this.state.text },
        { abortEarly: false }
      );
      this.setState({ errors: {} });
      return true;
    } catch (e) {
      let errors = {};
      e.inner.forEach(err => (errors[err.path] = err.message));
      this.setState({ errors });
      return false;
    }
  };

  InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: 'red' }}>
        {error}
      </div>
    ) : null;

  render() {
    const {
      close,
      t,
      ErrorBoundary,
      title,
      msg,
      btnText,
      setValue,
      successMsg
    } = this.props;
    const { text, errors } = this.state;
    return (
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup photo-verification">
                  <div className="m-head">
                    <span className="heading">{title}</span>
                    <span className="close" onClick={() => close()} />
                  </div>
                  <div className="m-body">
                    {msg}
                    <ErrorBoundary>
                      <input
                        placeholder={t('writemsg') + '...'}
                        value={text}
                        onChange={this.handleTextChange}
                      />
                      {this.InputFeedback(errors.text)}
                      <button
                        onClick={async () => {
                          if (await this.validateForm()) {
                            setValue(text);
                            successMsg && this.successMsg(successMsg);
                            close();
                          }
                        }}
                      >
                        {btnText}
                      </button>
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default withNamespaces('modals')(Dialog);
