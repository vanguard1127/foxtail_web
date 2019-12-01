import React, { PureComponent } from "react";
import { CANCEL_SUBSCRIPTION } from "../../../queries";
import { Mutation } from "react-apollo";
import ContactUsModal from "../../Modals/ContactUs";
class CancelSubBtn extends PureComponent {
  state = { showContactModal: false };
  handleSubmit = ({ cancelSubscription }) => {
    cancelSubscription()
      .then(({ data }) => {
        this.props.ReactGA.event({
          category: "Subscription",
          action: "Cancelled"
        });
        this.props.notifyClient(this.props.t("cancelblk"));
        window.location.reload(false);
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res);
      });
  };
  toggleContactModal = () => {
    this.setState({ showContactModal: !this.state.showContactModal });
  };
  render() {
    const { t, initializeModal } = this.props;
    const { showContactModal } = this.state;
    return (
      <Mutation mutation={CANCEL_SUBSCRIPTION}>
        {cancelSubscription => {
          return (
            <>
              <span
                onClick={this.toggleContactModal}
                className="clickverify-btn photo"
              >
                {t("subcancel")}
              </span>
              {showContactModal && (
                <ContactUsModal
                  close={this.toggleContactModal}
                  isDelete={true}
                  callback={() => {
                    this.toggleContactModal();
                    const title = t("cancelblktitle");
                    const msg = t("canblkdes");
                    const btnText = t("common:Cancel");
                    initializeModal({
                      title,
                      msg,
                      btnText,
                      okAction: () =>
                        this.handleSubmit({
                          cancelSubscription
                        })
                    });
                  }}
                  header={t("Why are you downgrading?")}
                  description={t(
                    "Please note - The photo limit on free accounts is 4, we will have to remove any photos over this limit."
                  )}
                  cancelText={t("Send Complaint & Remain a Black Member")}
                  okText={t("Cancel Black Membership")}
                />
              )}
            </>
          );
        }}
      </Mutation>
    );
  }
}

export default CancelSubBtn;
