import React, { PureComponent } from "react";
import { CANCEL_SUBSCRIPTION } from "../../../queries";
import { Mutation } from "react-apollo";
class CancelSubBtn extends PureComponent {
  handleSubmit = ({ cancelSubscription }) => {
    cancelSubscription()
      .then(({ data }) => {
        this.props.notifyClient(this.props.t("cancelblk"));
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
              onClick={() => {
                const title = t("cancelblktitle");
                const msg = t("canblkdes");
                const btnText = t("common:Cancel");
                setDialogContent({
                  title,
                  msg,
                  btnText,
                  okAction: () =>
                    this.handleSubmit({
                      cancelSubscription
                    })
                });
              }}
              className="clickverify-btn photo"
            >
              {t("subcancel")}
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default CancelSubBtn;
