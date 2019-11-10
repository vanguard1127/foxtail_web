import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { RESET_PASSWORD } from "../../../queries";

class ResetPasswordBtn extends PureComponent {
  handleClick = resetPassword => {
    const { t, close, ErrorHandler } = this.props;

    resetPassword()
      .then(() => {
        alert(t("common:2fasuccess"));
        close();
      })
      .catch(res => {
        ErrorHandler.catchErrors(res.graphQLErrors);
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
