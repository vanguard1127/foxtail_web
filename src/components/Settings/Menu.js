import React, { PureComponent } from 'react';

class Menu extends PureComponent {
  render() {
    const {
      coupleModalToggle,
      couplePartner,
      blackModalToggle,
      t,
      flashCpl,
      currentuser
    } = this.props;
    return (
      <div className="menu">
        <ul>
          <li className="active">
            <span>{t('common:myaccount')}</span>
          </li>
          <li>
            <span
              onClick={() => coupleModalToggle()}
              className={flashCpl ? 'flashCpl' : null}
            >
              {couplePartner === null ? t('common:addcoup') : couplePartner}
            </span>
          </li>
          <li style={{ color: '#000' }}>
            {currentuser.blackMember.active ? (
              <span style={{ cursor: 'auto' }}>{t('common:thanks')}.</span>
            ) : (
              <span onClick={blackModalToggle}>{t('common:becomeblk')}</span>
            )}
          </li>
        </ul>
      </div>
    );
  }
}

export default Menu;
