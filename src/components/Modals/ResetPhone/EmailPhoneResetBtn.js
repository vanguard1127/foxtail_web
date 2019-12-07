import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { SEND_PHONE_RESET_EMAIL } from "../../../queries";

class EmailPhoneResetBtn extends PureComponent {
  handleClick = async sendPhoneResetEmail => {
    const { t, close, ErrorHandler, validatePhone } = this.props;

    const isValid = await validatePhone();

    if (!isValid) {
      return;
    }

    sendPhoneResetEmail()
      .then(({ data }) => {
        alert(t("alreadyphonemsg"));
        close();
      })
      .catch(res => {
        ErrorHandler.catchErrors(res);
      });
  };

  render() {
    const { t, phone } = this.props;
    return (
      <Mutation mutation={SEND_PHONE_RESET_EMAIL} variables={{ phone }}>
        {sendPhoneResetEmail => {
          return (
            <button
              className="color"
              onClick={e => {
                e.preventDefault();

                this.handleClick(sendPhoneResetEmail);
              }}
            >
              {t("sendphoneres")}
            </button>
          );
        }}
      </Mutation>
    );
  }
}

export default EmailPhoneResetBtn;
