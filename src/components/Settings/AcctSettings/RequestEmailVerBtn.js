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
    const { t, ReactGA } = this.props;

    resendVerEMail()
      .then(({ data }) => {
        ReactGA.event({
          category: "Settings",
          action: "Resend Email Ver"
        });

        if (data.resendVerEMail) {
          toast.success("Email has sent successsfully");
          return;
        } else {
          toast(
            t(
              "common:Please wait at least 5 minutes to receive email verification. Check Spam, if it's not in your inbox."
            )
          );
        }
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
              className="clickverify-btn resetemail"
              onClick={() => this.handleClick(resendVerEMail)}
            >
              {t("resndemlver")}
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestEmailVerBtn;
