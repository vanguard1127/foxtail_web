import React from 'react';
import Spinner from '../common/Spinner';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import { CONFIRM_EMAIL } from '../../queries';
const PhoneConfirm = props => {
  return (
    <Redirect
      to={{
        pathname: '/',
        state: { phoneReset: true, token: props.match.params.token }
      }}
    />
  );
};

export default PhoneConfirm;
