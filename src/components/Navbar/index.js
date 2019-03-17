import React, { Fragment, Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { withNamespaces } from 'react-i18next';
import { TOGGLE_ONLINE } from '../../queries';
import axios from 'axios';

import UserToolbar from './UserToolbar';

class Navbar extends Component {
  state = { online: false };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.session !== nextProps.session ||
      this.state.online !== nextState.online
    ) {
      return true;
    }
    return false;
  }

  handleToggle = (toggleOnline, online) => {
    this.setState({ online }, () => {
      toggleOnline()
        .then(async ({ data }) => {
          if (data.toggleOnline !== null) {
            await this.props.refetch();
          }
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  render() {
    const { session, history, t, ErrorHandler } = this.props;
    const { online } = this.state;

    return (
      <Fragment>
        {session && session.currentuser ? (
          <Mutation
            mutation={TOGGLE_ONLINE}
            variables={{
              online
            }}
          >
            {(toggleOnline, { data, loading, error }) => (
              <NavbarAuth
                session={session}
                toggleOnline={online => this.handleToggle(toggleOnline, online)}
                t={t}
                ErrorHandler={ErrorHandler}
              />
            )}
          </Mutation>
        ) : (
          history.push('/')
        )}
      </Fragment>
    );
  }
}

//TODO: check it not id and try to make recursive
class NavbarAuth extends Component {
  state = {
    mobileMenu: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.session !== nextProps.session ||
      this.state.mobileMenu !== nextState.mobileMenu
    ) {
      return true;
    }
    return false;
  }

  toggleMobileMenu = () => {
    this.setState({ mobileMenu: !this.state.mobileMenu });
  };
  componentDidMount() {
    //TODO: Dont call if already online
    const { toggleOnline } = this.props;

    toggleOnline(true);

    //I don't know why but we need both
    window.addEventListener('beforeunload', () => {
      navigator.sendBeacon(
        'http://localhost:4444/offline?token=' + localStorage.getItem('token')
      );
    });
    window.addEventListener('unload', this.logData, false);
  }
  logData = () => {
    axios.get(
      'http://localhost:4444/offline?token=' + localStorage.getItem('token')
    );
  };
  render() {
    let href = window.location.href.split('/');
    href = href[3];
    const { session, t } = this.props;
    const { mobileMenu } = this.state;

    return (
      <div className="container">
        <div className="col-md-12">
          <div className="row no-gutters">
            <div className="mobile">
              <div className="mobile-menu">
                <div
                  className={
                    mobileMenu === true
                      ? 'hamburger hamburger--spring is-active'
                      : 'hamburger hamburger--spring'
                  }
                >
                  <span
                    className="hamburger-box"
                    onClick={() => this.toggleMobileMenu()}
                  >
                    <span className="hamburger-inner" />
                  </span>
                </div>
              </div>
              <div
                className={
                  mobileMenu === true ? 'mobile-toggle show' : 'mobile-toggle'
                }
              >
                <ul>
                  <li>
                    <NavLink to="/members">{t('meetmembers')}</NavLink>
                  </li>
                  <li>
                    <NavLink to="/events">{t('goevents')}</NavLink>
                  </li>
                  <li>
                    <NavLink to="/inbox">{t('common:Inbox')}</NavLink>
                  </li>
                  <li>
                    <span>{t('common:becomeblk')}</span>
                  </li>
                  <li>
                    <span>{t('common:myaccount')}</span>
                  </li>
                  <li>
                    <span>{t('common:addcoup')}</span>
                  </li>
                  <li>
                    <span>{t('common:Logout')}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-5 hidden-mobile">
              <ul className="menu">
                <li className={href === 'members' ? 'active' : ''}>
                  <NavLink to="/members">{t('meetmembers')}</NavLink>
                </li>
                <li className={href === 'events' ? 'active' : ''}>
                  <NavLink to="/events">{t('goevents')}</NavLink>
                </li>
              </ul>
            </div>
            <div className="col-md-2 col-12">
              <div className={mobileMenu === true ? 'logo white' : 'logo'}>
                <span />
              </div>
            </div>
            <div className="col-md-5 flexible">
              {session.currentuser && (
                <UserToolbar
                  currentuser={session.currentuser}
                  href={href}
                  t={t}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces('common')(withRouter(Navbar));
