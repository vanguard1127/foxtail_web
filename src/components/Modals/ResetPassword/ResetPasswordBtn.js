import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { RESET_PASSWORD } from "../../../queries";

class ResetPasswordBtn extends PureComponent {
  handleClick = resetPassword => {
    const { t, close, ErrorHandler, callback, ReactGA } = this.props;

    resetPassword()
      .then(data => {
        alert(t("2fasuccess"));
        ReactGA.event({
          category: "Reset Password",
          action: "Success"
        });
        callback();
        close();
      })
      .catch(res => {
        ReactGA.event({
          category: "Reset Password",
          action: "Failure"
        });
        ErrorHandler.catchErrors(res);
      });
    close();
  };
  render() {
    const { t, password, token } = this.props;

    return (
      <Mutation mutation={RESET_PASSWORD} variables={{ password, token }}>
        {resetPassword => {
          return (
            <span
              tabIndex="3"
              className="color"
              onClick={() => this.handleClick(resetPassword)}
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

export default ResetPasswordBtn;
