import React, { PureComponent } from 'react';
import { DELETE_USER } from '../../queries';
import { Mutation } from 'react-apollo';
import { ApolloConsumer } from 'react-apollo';

class DeactivateAcctBtn extends PureComponent {
  handleSubmit = ({ client, deleteUser }) => {
    deleteUser()
      .then(({ data }) => {
        alert(t('common:acctdeleted') + '.');

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.clear();
        client.resetStore();

        this.props.history.push('/');
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };
  render() {
    const { t } = this.props;
    return (
      <Mutation mutation={DELETE_USER}>
        {deleteUser => {
          return (
            <ApolloConsumer>
              {client => {
                return (
                  <button
                    onClick={() =>
                      this.handleSubmit({
                        client,
                        deleteUser
                      })
                    }
                  >
                    {t('common:deactacct')}
                  </button>
                );
              }}
            </ApolloConsumer>
          );
        }}
      </Mutation>
    );
  }
}

export default DeactivateAcctBtn;
