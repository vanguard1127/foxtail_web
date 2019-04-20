import React, { PureComponent } from "react";
import { CREATE_SUBSCRIPTION } from "../../../queries";
import { Mutation } from "react-apollo";
import StripeCheckout from "react-stripe-checkout";

class CreateSubBtn extends PureComponent {
  state = { token: "", ccLast4: "" };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  handleSubmit = ({ token, ccLast4, createSubscription }) => {
    if (this.mounted) {
      this.setState({ token, ccLast4 });
    }
    createSubscription()
      .then(({ data }) => {
        this.props.notifyClient("Black Membership Canceled Successfully");

        this.props.close();
        window.location.reload();
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  render() {
    const { token, ccLast4 } = this.state;
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
              name="Three Comma Co." // the pop-in header title
              description="Big Data Stuff" // the pop-in header subtitle
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
              <span className="color">Upgrade to Black Membership</span>
            </StripeCheckout>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateSubBtn;
