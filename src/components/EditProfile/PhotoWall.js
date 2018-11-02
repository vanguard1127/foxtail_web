import React from 'react';
import 'antd/dist/antd.css';
import { Icon, Modal, Upload } from 'antd';
import { Mutation } from 'react-apollo';
import { SIGNS3, UPLOAD_PHOTO } from '../../queries';
import axios from 'axios';
import { Button } from 'antd/lib/radio';
import { connect } from 'react-redux';
import { setImageForCanvas } from 'redux/actions/profilePageActions';

class PhotoWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    fileToLoad: null,
    filename: '',
    filetype: '',
    order: '0',
    photoUrl: ''
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = (file, fileList) => {
    this.props.dispatch(setImageForCanvas(fileList[0]));
    this.setState({
      fileList
    });
  };

  handleShowImage(fileToLoad) {
    this.setState({
      fileToLoad,
      previewImage: URL.createObjectURL(fileToLoad),
      previewVisible: true
    });
  }

  handleUpload = (signS3, uploadPhoto) => {
    const { fileToLoad } = this.state;

    this.setState({
      filename: fileToLoad.name,
      filetype: fileToLoad.type
    });
    //format name on backend
    //filename: this.formatFilename(file.name),
    signS3().then(async ({ data }) => {
      const { signedRequest, key } = data.signS3;
      await this.uploadToS3(fileToLoad, signedRequest);
      if (this.props.private) {
        this.setState({ photoUrl: key, order: this.state.fileList.length + 3 });
      } else {
        this.setState({ photoUrl: key, order: this.state.fileList.length - 1 });
      }

      try {
        uploadPhoto().then(async ({ data }) => {
          this.setState({
            previewImage: 'https://ft-img-bucket.s3.amazonaws.com/' + key,
            previewVisible: true
          });
          console.log('Response:', data);
        });
      } catch (e) {
        console.log('Error', e);
      }
    });
  };

  uploadToS3 = async (file, signedRequest) => {
    try {
      //ORIGINAL
      const options = {
        headers: {
          'Content-Type': file.type
        }
      };

      const resp = await axios.put(signedRequest, file, options);
      if (resp.status === 200) {
        console.log('upload ok');
      } else {
        console.log('Something went wrong');
      }
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    var filearray = [];

    for (var i = 0; i < this.props.fileList.length; i++) {
      if (this.props.fileList[i].url !== 'x') {
        filearray.push({
          uid: this.props.fileList[i].id,
          url: 'https://ft-img-bucket.s3.amazonaws.com/' +
          this.props.fileList[i].url
        });
      }
    }
    this.setState({
      fileList: filearray
    });
  }

  render() {
    const {
      order,
      photoUrl,
      filename,
      filetype,
      previewVisible,
      previewImage,
      fileList
    } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    function beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        alert('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        alert('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    }

    return (
      <Mutation mutation={UPLOAD_PHOTO} variables={{ order, url: photoUrl }}>
        {(uploadPhoto, { data, loading, error }) => (
          <Mutation mutation={SIGNS3} variables={{ filename, filetype }}>
            {(signS3, { data, loading, error }) => (
              <div className="clearfix">
                <Upload
                  data={file => this.handleShowImage(file)}
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onPreview={this.handlePreview}
                  onChange={({ file, fileList }) =>
                    this.handleChange(file, fileList)
                  }
                >
                  {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="original"
                    style={{ width: '100%' }}
                    src={previewImage}
                  />
                  <Button
                    onClick={() => this.handleUpload(signS3, uploadPhoto)}
                  >
                    Upload
                  </Button>
                </Modal>
              </div>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default connect()(PhotoWall);
