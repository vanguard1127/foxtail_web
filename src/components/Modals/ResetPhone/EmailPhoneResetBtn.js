import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { SEND_PHONE_RESET_EMAIL } from "../../../queries";

class EmailPhoneResetBtn extends PureComponent {
  handleClick = sendPhoneResetEmail => {
    const { t, close, ErrorHandler } = this.props;

    sendPhoneResetEmail()
      .then(({ data }) => {
        alert(t("alreadyphonemsg"));
        close();
      })
      .catch(res => {
        ErrorHandler.catchErrors(res);
        alert(t("common:error"));
        close();
      });
  };
  render() {
    const { t, phone, isValid } = this.props;
    return (
      <Mutation mutation={SEND_PHONE_RESET_EMAIL} variables={{ phone }}>
        {sendPhoneResetEmail => {
          return (
            <button
              className="color"
              onClick={e => {
                e.preventDefault();
                if (!isValid) {
                  return;
                }
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
