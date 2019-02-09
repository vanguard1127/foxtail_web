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
    //TODO: If on Settigns make popup show
    const { session, refetch, t, ErrorHandler, location, history } = this.props;
    let isCouple = false;
    let isInitial = false;
    let showBlkModal = false;
    let showCplModal = false;
    if (location.state) {
      if (location.state.couple) {
        isCouple = location.state.couple;
      }
      if (location.state.showBlkMdl) {
        showBlkModal = location.state.showBlkMdl;
      }
      if (location.state.showCplMdl) {
        showCplModal = location.state.showCplMdl;
      }

      if (location.state.initial) {
        isInitial = location.state.initial;
        // if (!toast.isActive("verEmail")) {
        //   toast.info("Please check your email to confirm your account.", {
        //     position: toast.POSITION.TOP_CENTER,
        //     toastId: "verEmail"
        //   });
        // }
      }
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
                  showBlkModal={showBlkModal}
                  showCplModal={showCplModal}
                  ErrorHandler={ErrorHandler}
                  history={history}
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
