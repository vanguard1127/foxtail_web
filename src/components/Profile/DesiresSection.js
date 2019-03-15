import React, { Component } from 'react';
import { desireOptions } from '../../docs/options';
class DesiresSection extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { desires, t } = this.props;
    return (
      <div className="desires">
        <div className="profile-head">{t('Desires')}</div>
        <ul>
          {desires.reduce(function(result, desire) {
            if (desireOptions.find(el => el.value === desire)) {
              result.push(
                <li key={desire}>
                  {t(desireOptions.find(el => el.value === desire).label)}
                </li>
              );
            }
            return result;
          }, [])}
        </ul>
      </div>
    );
  }
}

export default DesiresSection;
