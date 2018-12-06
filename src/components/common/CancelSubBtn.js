import React, { Component } from "react";
import { CANCEL_SUBSCRIPTION } from "../../queries";
import { Mutation } from "react-apollo";
import { message, Button } from "antd";

class CancelSubBtn extends Component {
  handleSubmit = ({ cancelSubscription }) => {
    cancelSubscription()
      .then(({ data }) => {
        this.props.refetchUser();
        message.success("Credit Card Removed and Subscription Canceled.");
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
    return (
      <Mutation mutation={CANCEL_SUBSCRIPTION}>
        {cancelSubscription => {
          return (
            <Button
              onClick={() =>
                this.handleSubmit({
                  cancelSubscription
                })
              }
            >
              Cancel Subscription
            </Button>
          );
        }}
      </Mutation>
    );
  }
}

export default CancelSubBtn;
