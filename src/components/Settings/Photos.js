import React, { Component } from 'react';
import UploadComponent from './UploadImageComponent';

class Photos extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.photos !== nextProps.photos) {
      return true;
    }
    return false;
  }
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
              max={7}
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
