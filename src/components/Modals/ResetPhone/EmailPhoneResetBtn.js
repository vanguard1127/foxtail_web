import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { SEND_PHONE_RESET_EMAIL } from "../../../queries";

class EmailPhoneResetBtn extends PureComponent {
  handleClick = sendPhoneResetEmail => {
    const { t, close, ErrorHandler } = this.props;

    sendPhoneResetEmail()
      .then(async ({ data }) => {
        alert(t("alreadyphonemsg"));
        close();
      })
      .catch(res => {
        ErrorHandler.catchErrors(res.graphQLErrors);
      });
    close();
  };
  render() {
    const { t, phone } = this.props;
    return (
      <Mutation mutation={SEND_PHONE_RESET_EMAIL} variables={{ phone }}>
        {sendPhoneResetEmail => {
          return (
            <span
              className="color"
              onClick={() => this.handleClick(sendPhoneResetEmail)}
            >
              {t("sendphoneres")}
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default EmailPhoneResetBtn;
