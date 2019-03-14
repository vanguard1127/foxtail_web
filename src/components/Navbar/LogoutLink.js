import React, { PureComponent } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';

class Logout extends PureComponent {
  handleLogout = (client, history) => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    //TODO: Causes console error but currently best options.
    client.resetStore();
    history.push('/');
  };

  render() {
    const { history, t } = this.props;
    return (
      <ApolloConsumer>
        {client => {
          return (
            <div onClick={() => this.handleLogout(client, history)}>
              {t('common:Logout')}
            </div>
          );
        }}
      </ApolloConsumer>
    );
  }
}
export default withRouter(Logout);
