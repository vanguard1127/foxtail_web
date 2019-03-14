import React, { PureComponent } from 'react';
import CreateSubBtn from './CreateSubBtn';
import Modal from '../../common/Modal';
import { withNamespaces } from 'react-i18next';

class Black extends PureComponent {
  state = { token: '', ccLast4: '' };

  render() {
    const { close, t, ErrorBoundary } = this.props;
    return (
      <Modal
        header={t('black')}
        close={close}
        description="Get more of what you love ❤️️"
        okSpan={
          <CreateSubBtn
            // refetchUser={this.props.refetchUser}
            close={close}
          />
        }
      >
        {' '}
        <ErrorBoundary>
          <img
            alt="upload"
            style={{ width: '100%' }}
            src={require('../../../images/girl2.jpg')}
          />
          <div>
            <h3>{t('blkinclude')}:</h3>
            <ul>
              <li>{t('direct')}</li>
              <li>{t('changeloc')}</li>
              <li>{t('onlyliked')}</li>
              <li>{t('hidestat')}</li>
              <li>{t('higher') + '!'}</li>
              <li>{t('phoneblock')}</li>
            </ul>
          </div>
        </ErrorBoundary>
      </Modal>
    );
  }
}
export default withNamespaces('modals')(Black);
