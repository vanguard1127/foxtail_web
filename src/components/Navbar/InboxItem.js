import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';

class InboxItem extends PureComponent {
  render() {
    const { count, active, t } = this.props;
    let iconstyle = 'inbox hidden-mobile';
    if (count > 0) {
      iconstyle += ' new';
    }
    if (active) {
      iconstyle += ' active';
    }

    return (
      <div className={iconstyle}>
        <NavLink to="/inbox">
          <span className="icon mail">
            <span className="count">{count}</span>
          </span>
          <span className="text">{t('common:Inbox')}</span>
        </NavLink>
      </div>
    );
  }
}

export default InboxItem;
