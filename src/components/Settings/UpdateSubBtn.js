import React, { PureComponent } from 'react';
import { UPDATE_SUBSCRIPTION } from '../../queries';
import { Mutation } from 'react-apollo';
import StripeCheckout from 'react-stripe-checkout';

class UpdateSubBtn extends PureComponent {
  state = { token: '', ccLast4: '' };
  handleSubmit = ({ token, ccLast4, updateSubscription, t }) => {
    this.setState({ token, ccLast4 });
    updateSubscription()
      .then(({ data }) => {
        this.props.refetchUser();
        alert(t('common:cardupdated') + '.');
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  render() {
    const { token, ccLast4 } = this.state;
    const { t } = this.props;
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
              <span className="clickverify-btn photo">
                {' '}
                {t('common:cardchange')}
              </span>
            </StripeCheckout>
          );
        }}
      </Mutation>
    );
  }
}

export default UpdateSubBtn;
