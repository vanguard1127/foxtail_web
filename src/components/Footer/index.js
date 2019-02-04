import React from 'react';
import { Mutation } from 'react-apollo';
import { SEEN_TOUR } from '../../queries';

import { withNamespaces } from 'react-i18next';

const Footer = ({ t }) => {
  return (
    <footer>
      <div className="brand">
        <div className="container">
          <div className="col-md-12">
            <div className="logo">
              <span />
            </div>
            <div className="medias">
              <ul>
                <li className="facebook">
                  <span>
                    <i />
                  </span>
                </li>
                <li className="twitter">
                  <span>
                    <i />
                  </span>
                </li>
                <li className="instagram">
                  <span>
                    <i />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <div className="col-md-12">
            <span className="text">
              © 2019 - 2020 Foxtail App Inc. {t('register')}.
            </span>
            <div className="menu">
              <ul>
                <li>
                  <Mutation
                    mutation={SEEN_TOUR}
                    variables={{
                      tour: 'reset'
                    }}
                  >
                    {seenTour => {
                      return <span onClick={() => seenTour()}>Reset Tour</span>;
                    }}
                  </Mutation>
                </li>
                <li>
                  <span>{t('termscon')}</span>
                </li>
                <li>
                  <span>{t('privacy')}</span>
                </li>
                <li>
                  <span>{t('contact')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default withNamespaces('footer')(Footer);
