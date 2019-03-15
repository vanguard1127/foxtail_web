import React, { PureComponent } from 'react';
import Upload from 'rc-upload';
import './UploadImageComponentStyle.css';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import ViewIcon from '@material-ui/icons/RemoveRedEye';
import StarIcon from '@material-ui/icons/Grade';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  addIcon: {
    fontSize: 45
  },
  progress: {
    'margin-top': '25px'
  }
});

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

class UploadComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      previewVisible: false,
      selectedImg: null, //for modal dialog
      loader: 'inline-block',
      uploadImg: 'none'
    };
  }

  imageUploaded = (res, file) => {
    var fileName = file.name;
    let idxDot = fileName.lastIndexOf('.') + 1;
    let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (
      extFile == 'jpg' ||
      extFile == 'jpeg' ||
      extFile == 'png' ||
      extFile == 'bmp' ||
      extFile == 'gif'
    ) {
      this.props.showEditor(file, this.props.isPrivate);
    } else {
      alert(this.props.t('onlyimg'));
    }
  };

  deleteFile = index => {
    let img = this.props.photos[index];

    if (img.uid) {
      img.id = img.uid;
    }
    this.props.deleteImg({ file: img });
  };
  //modal
  handleClickOpen = index => {
    let img = this.props.photos[index];

    this.setState({
      selectedImg: img.url,
      previewVisible: true
    });
  };

  handleClickProPic = ({ index, setProfilePic }) => {
    let img = this.props.photos[index];

    setProfilePic({ key: img.key, url: img.url });
  };

  handleClose = () => {
    this.setState({ previewVisible: false });
  };
  switchLoader = () => {
    this.setState({
      loader: 'none',
      uploadImg: 'block'
    });
  };

  render() {
    const { classes, photos, t, setProfilePic } = this.props;
    const { selectedImg, previewVisible } = this.state;
    return (
      <div className="header-container">
        {photos.map((file, index) => {
          return (
            <div key={file.uid || file.id}>
              <div className="loader">
                <CircularProgress
                  style={{ display: this.state.loader }}
                  className={classes.progress}
                />
              </div>
              <div
                className="imgContainer"
                style={{ display: this.state.uploadImg }}
              >
                <img
                  className="img-box"
                  src={file.url}
                  onLoad={() => {
                    setTimeout(this.switchLoader, 1000);
                  }}
                  alt=""
                />
                <div className="btns">
                  <div title={t('deletepic')}>
                    <DeleteIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        this.deleteFile(index);
                      }}
                    />
                  </div>
                  {!this.props.isPrivate && (
                    <div title={t('updatepro')}>
                      <StarIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          this.handleClickProPic({ index, setProfilePic });
                        }}
                      />
                    </div>
                  )}{' '}
                  <div title={t('viewpic')}>
                    <ViewIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        this.handleClickOpen(index);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {photos.length >= 4 ? null : (
          <div className="box">
            <Upload
              onSuccess={this.imageUploaded}
              onError={err => console.error(err)}
              accept=".jpg,.jpeg,.png,.bmp,.gif"
              customRequest={dummyRequest}
            >
              <div className="upload-box">
                <AddIcon className={classes.addIcon} />
                <p className="text">{t('Upload')}</p>
              </div>
            </Upload>
          </div>
        )}

        <Dialog
          onClose={this.handleClose}
          aria-labelledby="Image"
          open={previewVisible}
        >
          <img src={selectedImg} alt="" />
        </Dialog>
      </div>
    );
  }
}

UploadComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadComponent);
