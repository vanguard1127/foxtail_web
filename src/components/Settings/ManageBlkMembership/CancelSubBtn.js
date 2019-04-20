import React, { PureComponent } from "react";
import { CANCEL_SUBSCRIPTION } from "../../../queries";
import { Mutation } from "react-apollo";
class CancelSubBtn extends PureComponent {
  handleSubmit = ({ cancelSubscription }) => {
    cancelSubscription()
      .then(({ data }) => {
        this.props.notifyClient("Black Membership Canceled Successfully");
        window.location.reload();
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };
  render() {
    const { t, setDialogContent } = this.props;
    return (
      <Mutation mutation={CANCEL_SUBSCRIPTION}>
        {cancelSubscription => {
          return (
            <span
              onClick={() =>
                setDialogContent({
                  title: "Cancel Black Membership",
                  msg:
                    "This will cancel your Black Membership. You will have access to all Black features until your billing cycle ends.",
                  btnText: "Cancel",
                  okAction: () =>
                    this.handleSubmit({
                      cancelSubscription
                    })
                })
              }
              className="clickverify-btn photo"
            >
              {t("common:subcancel")}
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default CancelSubBtn;
