import React, { PureComponent } from 'react';

class Verifications extends PureComponent {
  render() {
    const { openPhotoVerPopup, t } = this.props;
    return (
      <div className="content mtop">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">
              {t('Verifications')} <i>- ({t('vertitle')})</i>
            </span>
          </div>
          <div className="col-md-6">
            <div className="verification-box">
              <span className="head">{t('photoverification')}</span>
              <span className="title">{t('photovermsg') + '...'}</span>
              <span
                className="clickverify-btn photo"
                onClick={() => openPhotoVerPopup('verify')}
              >
                {t('sendver')}
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="verification-box">
              <span className="head">{t('stdverification')}</span>
              <span className="title">{t('stdmsg') + '...'}</span>
              <span
                className="clickverify-btn"
                onClick={() => openPhotoVerPopup('std')}
              >
                {t('sendver')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Verifications;
