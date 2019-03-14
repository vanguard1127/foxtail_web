import React, { PureComponent } from 'react';
import EditCanvasImage from './ImageEditorWindow/EditCanvasImage';
import { withNamespaces } from 'react-i18next';
import Modal from '../../common/Modal';
class ImageEditor extends PureComponent {
  state = { photos: [], filename: '', filetype: '', photoKey: '' };
  setPhotos = photos => {
    this.setState({ photos });
  };

  render() {
    const {
      close,
      file,
      handlePhotoListChange,
      setS3PhotoParams,
      uploadToS3,
      signS3,
      t,
      ErrorBoundary
    } = this.props;

    return (
      <Modal header={t('editphoto')} close={close}>
        <ErrorBoundary>
          <EditCanvasImage
            imageObject={file}
            setS3PhotoParams={setS3PhotoParams}
            uploadToS3={uploadToS3}
            signS3={signS3}
            handlePhotoListChange={handlePhotoListChange}
            close={close}
            t={t}
          />
        </ErrorBoundary>
      </Modal>
    );
  }
}
export default withNamespaces('modals')(ImageEditor);
