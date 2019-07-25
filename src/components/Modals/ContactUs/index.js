import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import { withTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { MESSAGE_ADMIN } from "../../../queries";
import * as ErrorHandler from "../../common/ErrorHandler";
import Modal from "../../common/Modal";
import Spinner from "../../common/Spinner";
import * as yup from "yup";
import { toast } from "react-toastify";

class ContactUs extends Component {
  schema = yup.object().shape({
    email: yup.string().email(this.props.t("landing:invemail")),
    name: yup.string()
  });
  state = {
    name: "",
    email: "",
    text: "",
    sending: false,
    captchaOK: false,
    isValid: false,
    errors: {}
  };
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.text !== nextState.text ||
      this.state.name !== nextState.name ||
      this.state.captchaOK !== nextState.captchaOK ||
      this.state.errors !== nextState.errors ||
      this.state.email !== nextState.email ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  setValue = ({ name, value }) => {
    if (this.mounted) {
      this.setState({ [name]: value }, () => {
        this.validateForm();
      });
    }
  };

  validateForm = async () => {
    try {
      if (this.mounted) {
        await this.schema.validate(this.state);
        this.setState({ isValid: true, errors: {} });
        return true;
      }
    } catch (e) {
      let errors = { [e.path]: e.message };

      this.setState({ isValid: false, errors });
      return false;
    }
  };

  InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: "red" }}>
        {error}
      </div>
    ) : null;

  handleSubmit = (e, messageAdmin, skipCallback) => {
    const { close, t, callback } = this.props;
    ErrorHandler.setBreadcrumb("contact us");
    e.preventDefault();
    this.setState({ sending: true }, () => {
      messageAdmin()
        .then(async ({ data }) => {
          if (callback && !skipCallback) {
            callback();
          } else {
            if (data.messageAdmin) {
              toast.success(t("common:msgsent"));
              this.setState({ text: "" });
              close();
            } else {
              toast.error(t("msgnotsent"));
            }
          }
        })
        .catch(res => {
          ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  onChange = value => {
    this.setState({ captchaOK: true });
  };

  render() {
    const {
      close,
      t,
      guest,
      isDelete,
      header,
      description,
      cancelText,
      okText,
      tReady
    } = this.props;
    const {
      text,
      name,
      email,
      sending,
      captchaOK,
      errors,
      isValid
    } = this.state;

    if (!tReady) {
      return (
        <Modal close={close}>
          <Spinner />
        </Modal>
      );
    }
    return (
      <Modal
        header={header}
        close={close}
        description={description}
        okSpan={
          (captchaOK && isValid) || (!guest && text) || isDelete ? (
            <Mutation
              mutation={MESSAGE_ADMIN}
              variables={{
                text,
                name,
                email
              }}
            >
              {(messageAdmin, { loading, error }) => {
                return (
                  <>
                    {isDelete && text && (
                      <button
                        className="color"
                        type="submit"
                        onClick={e => this.handleSubmit(e, messageAdmin, true)}
                        disabled={sending}
                      >
                        {cancelText}
                      </button>
                    )}
                    <button
                      className="border"
                      type="submit"
                      onClick={e => this.handleSubmit(e, messageAdmin, false)}
                      disabled={sending}
                    >
                      {okText}
                    </button>
                  </>
                );
              }}
            </Mutation>
          ) : null
        }
      >
        <>
          {guest && (
            <>
              {" "}
              <div className="input">
                {" "}
                <input
                  placeholder={"Name"}
                  value={name}
                  onChange={e => {
                    this.setValue({
                      name: "name",
                      value: e.target.value
                    });
                  }}
                  autoFocus
                />
                {this.InputFeedback(errors.name)}
              </div>
              <div className="input">
                <input
                  placeholder={"Email"}
                  value={email}
                  onChange={e => {
                    this.setValue({
                      name: "email",
                      value: e.target.value
                    });
                  }}
                />
                {this.InputFeedback(errors.email)}
              </div>
            </>
          )}
          <div className="input">
            <textarea
              placeholder={t("writemsg") + "..."}
              rows={4}
              value={text}
              onChange={e => {
                this.setValue({
                  name: "text",
                  value: e.target.value
                });
              }}
              autoFocus
            />
          </div>
          {guest && (
            <div className="input">
              <ReCAPTCHA
                sitekey="6LdvxqYUAAAAAEnP6CGkMWBUiznH8Ulm6K1Mm4A9"
                onChange={this.onChange}
              />
            </div>
          )}
        </>
      </Modal>
    );
  }
}
export default withApollo(withTranslation("modals")(ContactUs));
