import React, { PureComponent } from 'react';
import { CANCEL_SUBSCRIPTION } from '../../queries';
import { Mutation } from 'react-apollo';
class CancelSubBtn extends PureComponent {
  handleSubmit = ({ cancelSubscription }) => {
    cancelSubscription()
      .then(({ data }) => {
        this.props.refetchUser();
        alert(t('common:cancelsubmsg' + '.'));
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
    const { t } = this.props;
    return (
      <Mutation mutation={CANCEL_SUBSCRIPTION}>
        {cancelSubscription => {
          return (
            <button
              onClick={() =>
                this.handleSubmit({
                  cancelSubscription
                })
              }
            >
              {t('common:subcancel')}
            </button>
          );
        }}
      </Mutation>
    );
  }
}

export default CancelSubBtn;
