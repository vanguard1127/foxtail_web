import React, { PureComponent } from "react";
import { withNamespaces } from "react-i18next";
import { toast } from "react-toastify";

import Dropdown from "../../common/Dropdown";
import Modal from "../../common/Modal";
class Dialog extends PureComponent {
  state = { text: "", errors: {} };
  componentDidMount() {
    this.mounted = true;
    if (this.props.specialType !== "gender") {
      this.textInput.focus();
    }
  }
  handleTextChange = event => {
    if (this.mounted) {
      this.setState({ text: event.target.value });
    }
  };

  setValue = text => {
    if (this.mounted) {
      this.setState({ text });
    }
  };

  successMsg = msg => {
    toast.success(msg);
  };

  validateForm = async () => {
    if (this.mounted) {
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
    }
  };

  InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: "red" }}>
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
      successMsg,
      specialType,
      lang
    } = this.props;
    const { text, errors } = this.state;
    let inputField;
    if (specialType === "gender") {
      inputField = (
        <Dropdown
          value={text}
          type={"gender"}
          onChange={e => {
            this.setValue(e.value);
          }}
          placeholder={t("common:Gender") + ":"}
          lang={lang}
        />
      );
    } else {
      inputField = (
        <div className="input">
          <input
            placeholder={t("writemsg") + "..."}
            value={text}
            onChange={this.handleTextChange}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
      );
    }
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
          {inputField}
          {this.InputFeedback(errors.text)}
        </ErrorBoundary>
      </Modal>
    );
  }
}
export default withNamespaces("modals")(Dialog);
