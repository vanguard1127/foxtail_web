import React from "react";
import { CANCEL_SUBSCRIPTION } from "../../queries";
import { Mutation } from "react-apollo";
const CancelSubBtn = () => {
  const handleSubmit = ({ cancelSubscription }) => {
    cancelSubscription()
      .then(({ data }) => {
        this.props.refetchUser();
        alert("Credit Card Removed and Subscription Canceled.");
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  return (
    <Mutation mutation={CANCEL_SUBSCRIPTION}>
      {cancelSubscription => {
        return (
          <button
            onClick={() =>
              handleSubmit({
                cancelSubscription
              })
            }
          >
            Cancel Subscription
          </button>
        );
      }}
    </Mutation>
  );
};

export default CancelSubBtn;
