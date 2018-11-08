import React from "react";
import "antd/dist/antd.css";
import { Icon, Modal, Upload } from "antd";
import { Mutation } from "react-apollo";
import { SIGNS3, UPLOAD_PHOTO } from "queries";
import axios from "axios";
import EditCanvasImage from "components/EditProfile/EditCanvasImage";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

class PhotoWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: [],
    fileToLoad: null,
    filename: "",
    filetype: "",
    order: "0",
    photoUrl: ""
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    console.log("PRE", file);
    this.setState({
      file,
      previewVisible: true
    });
  };

  handleChange = (file, fileList) => {
    this.setState({
      file,
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

  setPhotoDetails = (name, type) => {
    this.setState({
      filename: name,
      filetype: type
    });
  };

  setProfilePicDetails = ({ photoUrl, order }) => {
    console.log("order", order, "filelist", this.state.fileList);
    this.setState({
      photoUrl,
      order
    });
  };

  uploadToS3 = async (file, signedRequest) => {
    try {
      //ORIGINAL
      const options = {
        headers: {
          "Content-Type": file.type
        }
      };

      const resp = await axios.put(signedRequest, file, options);
      if (resp.status === 200) {
        console.log("upload ok");
      } else {
        console.log("Something went wrong");
      }
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    var filearray = [];

    for (var i = 0; i < this.props.fileList.length; i++) {
      if (this.props.fileList[i].url !== "x") {
        filearray.push({
          uid: this.props.fileList[i].id,
          url:
            "https://ft-img-bucket.s3.amazonaws.com/" +
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
      fileList,
      file
    } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    function beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        alert("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        alert("Image must smaller than 2MB!");
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
                  customRequest={dummyRequest}
                >
                  {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <EditCanvasImage
                    imageObject={file}
                    signS3={signS3}
                    uploadPhoto={uploadPhoto}
                    setPhotoDetails={this.setPhotoDetails}
                    uploadToS3={this.uploadToS3}
                    fileList={fileList}
                    setProfilePicDetails={this.setProfilePicDetails}
                  />
                </Modal>
              </div>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default PhotoWall;
