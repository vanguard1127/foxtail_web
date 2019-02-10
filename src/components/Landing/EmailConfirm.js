import React from 'react';
import Spinner from '../common/Spinner';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import { CONFIRM_EMAIL } from '../../queries';
const EmailConfirm = props => {
  return (
    <Query
      query={CONFIRM_EMAIL}
      variables={{ token: props.match.params.token }}
    >
      {({ data, loading, error }) => {
        if (error) {
          return (
            <props.ErrorHandler.report
              error={error}
              calledName={'confirmEvent'}
            />
          );
        }

        if (loading) {
          return <Spinner message={'...'} size="large" />;
        }
        if (data.confirmEmail) {
          return <Redirect to={{ pathname: '/', state: { emailVer: true } }} />;
        }

        return <Redirect to={{ pathname: '/', state: { emailVer: false } }} />;
      }}
    </Query>
  );
};

export default EmailConfirm;
