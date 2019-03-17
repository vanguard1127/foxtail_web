import React, { PureComponent } from 'react';
import { CANCEL_SUBSCRIPTION } from '../../queries';
import { Mutation } from 'react-apollo';
class CancelSubBtn extends PureComponent {
  handleSubmit = ({ cancelSubscription }) => {
    cancelSubscription()
      .then(({ data }) => {
        this.props.refetchUser();
        alert(this.props.t('common:cancelsubmsg' + '.'));
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };
  render() {
    const { t } = this.props;
    return (
      <Mutation mutation={CANCEL_SUBSCRIPTION}>
        {cancelSubscription => {
          return (
            <span
              onClick={() =>
                this.handleSubmit({
                  cancelSubscription
                })
              }
              className="clickverify-btn photo"
            >
              {t('common:subcancel')}
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default CancelSubBtn;
