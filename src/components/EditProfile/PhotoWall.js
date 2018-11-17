import React from "react";
import "antd/dist/antd.css";
import { Icon, Modal, Upload } from "antd";
import { Mutation } from "react-apollo";
import { SIGNS3 } from "queries";
import axios from "axios";
import EditCanvasImage from "components/EditProfile/EditCanvasImage";
import PhotoModal from "../common/PhotoModal";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

class PhotoWall extends React.Component {
  state = {
    editorVisible: false,
    previewVisible: false,
    previewImage: "",
    fileList: [],
    fileToLoad: null,
    filename: "",
    filetype: "",
    file: null,
    order: "0",
    photoUrl: "",
    photoID: null
  };

  handleCancel = resetFilelist => {
    //TODO: figure out why clearing file here fixes flash issue but causes unmounted error
    this.setState({ editorVisible: false, previewVisible: false });
    if (resetFilelist) {
      this.loadSavedPics();
    }
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleShowImage() {
    this.setState({
      file: null,
      editorVisible: true
    });
  }

  setS3PhotoParams = (name, type) => {
    this.setState({
      filename: name,
      filetype: type
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
    this.loadSavedPics();
  }

  loadSavedPics = async () => {
    var filearray = [];

    for (var i = 0; i < this.props.photos.length; i++) {
      if (this.props.photos[i].url !== "x") {
        filearray.push({
          uid: this.props.photos[i].id,
          url:
            "https://ft-img-bucket.s3.amazonaws.com/" + this.props.photos[i].url
        });
      }
    }
    this.setState(
      {
        fileList: filearray
      },
      async () =>
        await this.props.handlePhotoListChange(
          this.state.fileList,
          this.props.privatePic
        )
    );
  };

  handleChange = async (file, fileList, isUpload, handlePhotoListChange) => {
    if (file.status === "removed") {
      await handlePhotoListChange(fileList, this.props.privatePic);
    }

    if (isUpload) {
      const fileArray = [...this.state.fileList];
      fileArray[fileArray.length - 1].url =
        "https://ft-img-bucket.s3.amazonaws.com/" +
        fileArray[fileArray.length - 1].url;

      this.setState({
        fileList: fileArray
      });

      await handlePhotoListChange(fileList, this.props.privatePic);
      this.handleCancel(false);
    } else {
      this.setState({
        file,
        fileList
      });
    }
  };
  render() {
    const {
      filename,
      filetype,
      editorVisible,
      previewVisible,
      previewImage,
      fileList,
      file
    } = this.state;
    const { handlePhotoListChange } = this.props;

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
      <Mutation mutation={SIGNS3} variables={{ filename, filetype }}>
        {signS3 => {
          return (
            <div className="clearfix">
              <Upload
                data={() => this.handleShowImage()}
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onPreview={file => this.handlePreview(file)}
                onChange={({ file, fileList }) =>
                  this.handleChange(
                    file,
                    fileList,
                    false,
                    handlePhotoListChange
                  )
                }
                customRequest={dummyRequest}
              >
                {fileList.length >= 4 ? null : uploadButton}
              </Upload>
              <Modal
                visible={editorVisible}
                footer={null}
                onCancel={() => this.handleCancel(true)}
              >
                {editorVisible && (
                  <EditCanvasImage
                    imageObject={file}
                    signS3={signS3}
                    setS3PhotoParams={this.setS3PhotoParams}
                    uploadToS3={this.uploadToS3}
                    fileList={fileList}
                    handlePhotoListChange={({ file, fileList }) =>
                      this.handleChange(
                        file,
                        fileList,
                        true,
                        handlePhotoListChange
                      )
                    }
                  />
                )}
              </Modal>
              <PhotoModal
                previewVisible={previewVisible}
                previewImage={previewImage}
                handleCancel={() => this.handleCancel(false)}
              />
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default PhotoWall;
