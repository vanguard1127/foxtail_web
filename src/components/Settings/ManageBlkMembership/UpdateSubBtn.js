import React, { PureComponent } from "react";
import { UPDATE_SUBSCRIPTION } from "../../../queries";
import { Mutation } from "react-apollo";
import StripeCheckout from "react-stripe-checkout";

class UpdateSubBtn extends PureComponent {
  state = { token: "", ccLast4: "" };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  handleSubmit = ({ token, ccLast4, updateSubscription, t }) => {
    if (this.mounted) {
      this.setState({ token, ccLast4 });
      updateSubscription()
        .then(({ data }) => {
          this.props.ReactGA.event({
            category: "Subscription",
            action: "Updated"
          });
          this.props.notifyClient(t("ccupdate"));
          window.location.reload(false);
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    }
  };

  render() {
    const { token, ccLast4 } = this.state;
    const { t, lang, currCCLast4 } = this.props;
    return (
      <Mutation
        mutation={UPDATE_SUBSCRIPTION}
        variables={{
          token,
          ccLast4
        }}
      >
        {updateSubscription => {
          return (
            <StripeCheckout
              token={({ id, card }) =>
                this.handleSubmit({
                  token: id,
                  ccLast4: card.last4,
                  updateSubscription,
                  t
                })
              }
              stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
              panelLabel="Update"
              locale={lang}
            >
              <span className="clickverify-btn photo">
                {" "}
                {currCCLast4 ? t("cardchange") : t("addchange")}
              </span>
            </StripeCheckout>
          );
        }}
      </Mutation>
    );
  }
}

export default UpdateSubBtn;
