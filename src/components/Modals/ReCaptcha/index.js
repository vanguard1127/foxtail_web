import React, { Component } from "react";
import { Mutation } from "react-apollo";
import ReCAPTCHA from "react-google-recaptcha";
import { withTranslation } from "react-i18next";
import { CONFIRM_HUMAN } from "../../../queries";
import * as ErrorHandler from "../../common/ErrorHandler";
import Modal from "../../common/Modal";
import { toast } from "react-toastify";

class ReCaptcha extends Component {
  state = {
    capToken: null
  };
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.capToken !== nextState.capToken ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }

  InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: "red" }}>
        {error}
      </div>
    ) : null;

  onChange = (value, confirmHuman) => {
    this.setState({ capToken: value }, () => {
      confirmHuman()
        .then(async ({ data }) => {
          if (data.confirmHuman) {
            toast.success("Humanity confirmed");
            window.location.reload();
          } else {
            toast.error(
              this.props.t(
                "common:Please contact support at support@foxtailapp.com to regian access to your account."
              )
            );
          }
        })
        .catch(res => {
          ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  render() {
    const { t } = this.props;
    const { capToken } = this.state;

    return (
      <Modal
        header={"Are you Human?"}
        description={t(
          "common:We've detected some bot-like behavior from your session. Please complete this captcha so we know you're human. Sorry for the inconvienence."
        )}
      >
        <>
          <Mutation
            mutation={CONFIRM_HUMAN}
            variables={{
              capToken
            }}
          >
            {confirmHuman => {
              return (
                <div>
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_GOOGLE_CLIENT_KEY}
                    onChange={value => this.onChange(value, confirmHuman)}
                  />
                </div>
              );
            }}
          </Mutation>
        </>
      </Modal>
    );
  }
}
export default withTranslation("modals")(ReCaptcha);
