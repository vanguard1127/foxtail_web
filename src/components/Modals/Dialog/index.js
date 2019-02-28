import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { toast } from 'react-toastify';

import Modal from '../../common/Modal';
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
      <Modal
        header={title}
        close={close}
        description={msg}
        okSpan={
          <span
            className="color"
            onClick={async () => {
              if (await this.validateForm()) {
                setValue(text);
                successMsg && this.successMsg(successMsg);
                close();
              }
            }}
          >
            {btnText}
          </span>
        }
      >
        <ErrorBoundary>
          <div className="input">
            <input
              placeholder={t('writemsg') + '...'}
              value={text}
              onChange={this.handleTextChange}
            />
          </div>

          {this.InputFeedback(errors.text)}
        </ErrorBoundary>
      </Modal>
    );
  }
}
export default withNamespaces('modals')(Dialog);
