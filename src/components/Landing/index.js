import React from 'react';
import Signup from './Signup';
import LoginButton from './LoginButton';
import LanguageControl from '../common/LanguageControl/LanguageControl';
import { ErrorBoundary, setBreadcrumb } from '../common/ErrorHandler';
import CountUp from 'react-countup';

import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
import 'react-toastify/dist/ReactToastify.min.css';
import { withNamespaces } from 'react-i18next';

const Landing = ({ t, props }) => {
  if (props.location.state) {
    if (props.location.state.emailVer === true) {
      if (!toast.isActive('emailVer')) {
        toast.success('Email has been confirmed.', {
          position: toast.POSITION.TOP_CENTER,
          toastId: 'emailVer'
        });

        props.history.replace({ state: {} });
      }
    } else if (props.location.state.emailVer === false) {
      if (!toast.isActive('errVer')) {
        toast.error('Email confirmation failed, please try again.', {
          position: toast.POSITION.TOP_CENTER,
          toastId: 'errVer'
        });

        props.history.replace({ state: {} });
      }
    }
  }
  return (
    <div>
      <header className="landing">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-4">
                <div className="logo">
                  <span />
                </div>
              </div>
              <div className="offset-md-3 col-md-5">
                <div className="content">
                  <ErrorBoundary>
                    <LoginButton t={t} />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    {' '}
                    <LanguageControl />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="landing">
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <div className="col-lg-7 col-md-12">
                  <div className="left">
                    <div className="welcome-text">
                      <h1>{t('title')}</h1>
                      <span className="title">{t('subtitle')}</span>
                    </div>
                    <div className="stats">
                      <div className="head">
                        <span> {t('Welcome')}</span>{' '}
                        <span> {t('Foxtail Stats')}</span>
                      </div>
                      <ErrorBoundary>
                        <ul>
                          <li>
                            <span className="counter">
                              <CountUp
                                end={19538}
                                duration={1.75}
                                separator="."
                              />
                            </span>
                            <span>{t('Male Members')}</span>
                          </li>
                          <li>
                            <span className="counter">
                              {' '}
                              <CountUp
                                end={19538}
                                duration={1.75}
                                separator="."
                              />
                            </span>
                            <span>{t('Female Members')}</span>
                          </li>
                          <li>
                            <span className="counter">
                              {' '}
                              <CountUp
                                end={19538}
                                duration={1.75}
                                separator="."
                              />
                            </span>
                            <span>{t('Couple Profiles')}</span>
                          </li>
                        </ul>
                      </ErrorBoundary>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12">
                  <ErrorBoundary>
                    {' '}
                    <Signup t={t} setBreadcrumb={setBreadcrumb} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-4">
                <span className="created">
                  Foxtail © 2018 {t('Created by')} <span>Foxtail</span>
                </span>
              </div>
              <div className="offset-md-2 col-md-6">
                <div className="links">
                  <ul>
                    <li>
                      <span>{t('common:Terms')}</span>
                    </li>
                    <li>
                      <span>{t('common:Privacy')}</span>
                    </li>
                    <li>
                      <span>{t('FAQ')}</span>
                    </li>
                    <li>
                      <span>{t('About')}</span>
                    </li>
                    <li>
                      <span>{t('Support')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default withNamespaces('landing')(Landing);
