import React, { PureComponent } from 'react';
import UploadComponent from './UploadImageComponent';

class Photos extends PureComponent {
  render() {
    const {
      isPrivate,
      showEditor,
      photos,
      deleteImg,
      t,
      setProfilePic
    } = this.props;
    return (
      <div className="content mtop">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">
              {!isPrivate ? t('pubphotos') : t('privphotos')}
              <i> {!isPrivate ? '- ' + t('nonude') : '- ' + t('nudeok')}</i>
            </span>
          </div>
          <div className="col-md-12">
            <UploadComponent
              setProfilePic={setProfilePic}
              max={4}
              showEditor={showEditor}
              photos={photos}
              isPrivate={isPrivate}
              deleteImg={deleteImg}
              t={t}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Photos;
