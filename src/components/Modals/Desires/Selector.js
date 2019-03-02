import React, { Component } from 'react';
import { desireOptions } from '../../../docs/options';
import { withNamespaces } from 'react-i18next';

class Selector extends Component {
  render() {
    const { togglePopup, desires, t, ErrorBoundary } = this.props;

    return (
      <span>
        <div
          className="select_desires desires_select_popup"
          onClick={() => togglePopup()}
        >
          <span className="label">{t('seldesires')}:</span>
          <ErrorBoundary>
            <ul>
              {desires.reduce(function(result, desire, idx) {
                //TODO: fix key issued using uuid
                if (result.length < 10) {
                  const desireObj = desireOptions.find(
                    el => el.value === desire
                  );
                  result.push(<li key={desire}>{t(desireObj.label)}</li>);
                  if (result.length > 9) {
                    result.push(<li key={'na'}>...</li>);
                  }
                } else {
                  result[result.length - 1] = (
                    <li key={idx}>{'+ ' + idx + ' more'}</li>
                  );
                }
                return result;
              }, [])}
            </ul>
          </ErrorBoundary>
        </div>
      </span>
    );
  }
}

export default withNamespaces('modals')(Selector);
