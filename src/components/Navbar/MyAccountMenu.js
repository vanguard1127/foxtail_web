import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Logout from './LogoutLink';

const MyAccountMenu = ({ t, history }) => {
  return (
    <div className="toggle">
      <div className="dropdown hidden-mobile open">
        <ul>
          <li>
            <NavLink to="/settings">{t('common:myaccount')}</NavLink>
          </li>
          <li>
            <span
              onClick={() =>
                history.push({
                  pathname: '/settings',
                  state: { showCplMdl: true }
                })
              }
            >
              {t('common:addcoup')}
            </span>
          </li>
          <li className="border">
            <span
              onClick={() =>
                history.push({
                  pathname: '/settings',
                  state: { showBlkMdl: true }
                })
              }
            >
              {t('common:becomeblk')}
            </span>
          </li>
          <li>
            <Logout t={t} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default withRouter(MyAccountMenu);
