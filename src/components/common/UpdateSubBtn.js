import React, { Component } from "react";
import { UPDATE_SUBSCRIPTION } from "../../queries";
import { Mutation } from "react-apollo";
import StripeCheckout from "react-stripe-checkout";

class UpdateSubBtn extends Component {
  state = { token: "", ccLast4: "" };
  handleSubmit = ({ token, ccLast4, updateSubscription }) => {
    this.setState({ token, ccLast4 });
    updateSubscription()
      .then(({ data }) => {
        this.props.refetchUser();
        alert("Credit Card Updated.");
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  render() {
    const { token, ccLast4 } = this.state;
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
                  updateSubscription
                })
              }
              stripeKey="pk_test_IdtGRrsuvxCLBd9AbDQBXCS3"
            >
              <button>Change Credit Card</button>
            </StripeCheckout>
          );
        }}
      </Mutation>
    );
  }
}

export default UpdateSubBtn;
