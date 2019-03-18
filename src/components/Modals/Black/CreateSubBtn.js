import React, { PureComponent } from 'react';
import { CREATE_SUBSCRIPTION } from '../../../queries';
import { Mutation } from 'react-apollo';
import StripeCheckout from 'react-stripe-checkout';

class CreateSubBtn extends PureComponent {
  state = { token: '', ccLast4: '' };
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
        this.props.refetchUser();
        this.props.close();
        alert(this.props.t('welblk'));
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
              token={({ id, card }) =>
                this.handleSubmit({
                  token: id,
                  ccLast4: card.last4,
                  createSubscription
                })
              }
              stripeKey="pk_test_IdtGRrsuvxCLBd9AbDQBXCS3"
              amount={1000}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default CreateSubBtn;
