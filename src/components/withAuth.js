import React from 'react';

import { Query } from 'react-apollo';

import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import { GET_CURRENT_USER } from '../queries';
const withAuth = conditionFunc => Component => props => {
  if (localStorage.getItem('token') === null) {
    props.history.push('/');
    return null;
  } else {
    return (
      <Query query={GET_CURRENT_USER}>
        {({ data, loading, refetch }) => {
          if (loading) {
            return null;
          }

          if (conditionFunc(data)) {
            if (
              !data.currentuser.isProfileOK &&
              ~window.location.href.indexOf('/settings') === 0
            ) {
              return (
                <Redirect
                  to={{
                    pathname: '/settings'
                  }}
                />
              );
            }
            // if (
            //   !data.currentuser.isEmailOK &&
            //   ~window.location.href.indexOf('/settings') === 0
            // ) {
            //   if (!toast.isActive('ever')) {
            //     toast.error(
            //       'Please check your inbox to confirm your email before contacting members! Resend',
            //       {
            //         toastId: 'ever',
            //         position: toast.POSITION.TOP_CENTER,
            //         autoClose: false,
            //         hideProgressBar: true,
            //         closeOnClick: false,
            //         pauseOnHover: false,
            //         draggable: false
            //       }
            //     );
            //   }
            // }

            return <Component {...props} session={data} refetch={refetch} />;
          } else {
            return <Redirect to="/" />;
          }
        }}
      </Query>
    );
  }
};

export default withAuth;
