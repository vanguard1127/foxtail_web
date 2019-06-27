import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { toast } from "react-toastify";
import { RESEND_EMAIL_VER } from "../../../queries";

const initialState = {
  csrf: "",
  code: "",
  phone: ""
};

class RequestEmailVerBtn extends PureComponent {
  state = { ...initialState };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  handleClick = resendVerEMail => {
    const { t } = this.props;

    resendVerEMail()
      .then(({ data }) => {
        // if (data.resendVerEMail) {
        toast.success("Email has sent successsfully");
        return;
        // }
      })
      .catch(res => {
        toast.error("Error sending email");
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  render() {
    const { t } = this.props;
    return (
      <Mutation mutation={RESEND_EMAIL_VER}>
        {resendVerEMail => {
          return (
            <span
              className="clickverify-btn"
              onClick={() => this.handleClick(resendVerEMail)}
            >
              Resend Email Verification (To chat with members)
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestEmailVerBtn;
