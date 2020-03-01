import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { RESET_PASSWORD } from "../../../queries";

class ResetPasswordBtn extends PureComponent {
  handleClick = resetPassword => {
    const { t, close, ErrorHandler, callback, ReactGA } = this.props;

    resetPassword()
      .then(({ data }) => {
        if (data.resetPassword) {
          alert(t("Password Updated Successfully"));
          ReactGA.event({
            category: "Reset Password",
            action: "Success"
          });
          callback();
        } else {
          alert(t("modals:passupfail"));
        }
        close();
      })
      .catch(res => {
        alert(t("passupfail"));
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
              {t("setpass")}
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default ResetPasswordBtn;
