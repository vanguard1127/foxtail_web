import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { toast } from 'react-toastify';
import { Query } from 'react-apollo';
import { GET_SETTINGS } from '../../queries';
import Spinner from '../common/Spinner';
import withAuth from '../withAuth';

import SettingsPage from './SettingsPage';
//TODO: https://reactjs.org/docs/error-boundaries.html#where-to-place-error-boundaries
class Settings extends Component {
  componentDidMount() {
    if (!this.props.session.currentuser.isProfileOK) {
      const toastId = 'nopro';
      if (!toast.isActive(toastId)) {
        toast.info('Please complete your profile.', {
          position: toast.POSITION.TOP_CENTER,
          toastId: toastId
        });
      }
    }
  }
  //TODO: Set time below
  render() {
    const { session, refetch, t, ErrorHandler } = this.props;
    let isCouple = false;
    let isInitial = false;
    if (this.props.location.state) {
      isCouple = this.props.location.state.couple;
    }
    if (this.props.location.state) {
      isInitial = this.props.location.state.initial;
    }
    return (
      <Fragment>
        <section className="breadcrumb settings">
          <div className="container">
            <div className="col-md-12">
              <span className="head">
                <span>
                  {t('Hello')}, {session.currentuser.username} 👋
                </span>
              </span>
              <span className="title">
                {t('loggedin')}: 03 October 2018 13:34
              </span>
            </div>
          </div>
        </section>{' '}
        <Query query={GET_SETTINGS} fetchPolicy="network-only">
          {({ data, loading, error }) => {
            if (loading) {
              return (
                <Spinner message={t('common:Loading') + '...'} size="large" />
              );
            }
            if (error || !data.getSettings) {
              return (
                <ErrorHandler.report error={error} calledName={'getSettings'} />
              );
            }

            const settings = data.getSettings;

            return (
              <Fragment>
                <SettingsPage
                  settings={settings}
                  refetchUser={refetch}
                  t={t}
                  isCouple={isCouple}
                  isInitial={isInitial}
                  ErrorHandler={ErrorHandler}
                />
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default withRouter(
  withAuth(session => session && session.currentuser)(
    withNamespaces('settings')(Settings)
  )
);
