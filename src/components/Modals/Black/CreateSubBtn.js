import React, { PureComponent } from "react";
import { CREATE_SUBSCRIPTION } from "../../../queries";
import { Mutation } from "react-apollo";
import StripeCheckout from "react-stripe-checkout";

class CreateSubBtn extends PureComponent {
  state = { token: "", ccLast4: "", processing: false };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  handleSubmit = ({ token, ccLast4, createSubscription }) => {
    const { t, notifyClient, close, ErrorHandler } = this.props;
    if (this.mounted) {
      this.setState({ token, ccLast4, processing: true });
    }
    createSubscription()
      .then(({ data }) => {
        notifyClient(t("blkcancel"));

        close();
        window.location.reload();
      })
      .catch(res => {
        ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  render() {
    const { token, ccLast4, processing } = this.state;
    const { t } = this.props;
    return (
      <Mutation
        mutation={CREATE_SUBSCRIPTION}
        variables={{
          token,
          ccLast4
        }}
      >
        {createSubscription => {
          return (
            <StripeCheckout
              name={t("blkmemheader")} // the pop-in header title
              description={t("blkmemsubheader")} // the pop-in header subtitle
              token={({ id, card }) =>
                this.handleSubmit({
                  token: id,
                  ccLast4: card.last4,
                  createSubscription
                })
              }
              stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
              amount={1000}
            >
              <span className="color">
                {processing ? t("processing") : t("upgradeblk")}
              </span>
            </StripeCheckout>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateSubBtn;
