import React, { Component } from 'react';
class DesiresMobile extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { desires, t } = this.props;

    return (
      <div className="mobile desires">
        <div className="profile-head">{t('Desires')}</div>
        <ul>
          {desires.reduce(function(result, desire) {
            if (result.length > 1) {
              result.push(<li key={desire}>...</li>);
            } else {
              result.push(<li key={desire}>{t(desire)}</li>);
            }
            return result;
          }, [])}
        </ul>
      </div>
    );
  }
}

export default DesiresMobile;
