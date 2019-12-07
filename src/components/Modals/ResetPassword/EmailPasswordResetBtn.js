import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { SEND_PASSWORD_RESET_EMAIL } from "../../../queries";

class EmailPasswordResetBtn extends PureComponent {
  handleClick = sendPasswordResetEmail => {
    const { t, close, ErrorHandler } = this.props;
    sendPasswordResetEmail()
      .then(data => {
        alert(t("alreadypassmsg"));
        close();
      })
      .catch(res => {
        alert(t("alreadypassmsg"));
        ErrorHandler.catchErrors(res);
        close();
      });
  };
  render() {
    const { t, phone, email } = this.props;

    return (
      <Mutation
        mutation={SEND_PASSWORD_RESET_EMAIL}
        variables={{ phone, email }}
      >
        {sendPasswordResetEmail => {
          return (
            <span
              className="color"
              onClick={() => this.handleClick(sendPasswordResetEmail)}
              style={{ marginTop: "5px" }}
            >
              {t("sendpassres")}
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default EmailPasswordResetBtn;
