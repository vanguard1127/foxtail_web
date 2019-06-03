import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import { withNamespaces } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { MESSAGE_ADMIN } from "../../../queries";
import * as ErrorHandler from "../../common/ErrorHandler";
import Modal from "../../common/Modal";
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
    if (this.props.guest) {
      this.nameInput.focus();
    } else {
      this.textInput.focus();
    }
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
      this.state.email !== nextState.email
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

  handleSubmit = (e, messageAdmin) => {
    ErrorHandler.setBreadcrumb("contact us");
    e.preventDefault();
    this.setState({ sending: true }, () => {
      messageAdmin()
        .then(async ({ data }) => {
          if (data.messageAdmin) {
            toast.success(this.props.t("common:msgsent"));
            this.setState({ text: "" });
            this.props.close();
          } else {
            toast.error(this.props.t("msgnotsent"));
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
    const { close, t, guest } = this.props;
    const {
      text,
      name,
      email,
      sending,
      captchaOK,
      errors,
      isValid
    } = this.state;
    return (
      <Modal
        header={"Send us a Message"}
        close={close}
        description={!guest && "Questions/Comments/Suggestions/etc..."}
        okSpan={
          (captchaOK && isValid) || (!guest && text) ? (
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
                  <button
                    className="color"
                    type="submit"
                    onClick={e => this.handleSubmit(e, messageAdmin)}
                    disabled={sending}
                  >
                    {t("common:Send")}
                  </button>
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
                  ref={input => {
                    this.nameInput = input;
                  }}
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
              ref={input => {
                this.textInput = input;
              }}
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
export default withApollo(withNamespaces("modals")(ContactUs));