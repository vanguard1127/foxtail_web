import React from "react";
import "antd/dist/antd.css";
import { Upload, Icon, Modal } from "antd";
import { Mutation } from "react-apollo";
import { SIGNS3, UPLOAD_PHOTO } from "../../queries";
import axios from "axios";

class PhotoWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: [],
    file: null,
    filename: "",
    filetype: "",
    order: "1",
    photoUrl: ""
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => {
    console.log(fileList);
    this.setState({ fileList });
  };

  handleUpload = (file, signS3, uploadPhoto) => {
    this.setState({
      filename: file.name,
      filetype: file.type
    });
    //format name on backend
    //filename: this.formatFilename(file.name),
    signS3().then(async ({ data }) => {
      const { signedRequest, key } = data.signS3;
      await this.uploadToS3(file, signedRequest);
      this.setState({ photoUrl: key });
      try {
        uploadPhoto().then(async ({ data }) => {
          console.log("GraphResponse::::", data);
        });
      } catch (e) {
        console.log("ERRRR", e);
      }
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
    console.log("KKK", this.props.fileList);
    this.setState({
      fileList: this.props.fileList
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
      <Mutation mutation={UPLOAD_PHOTO} variables={{ order, photoUrl }}>
        {(uploadPhoto, { data, loading, error }) => (
          <Mutation mutation={SIGNS3} variables={{ filename, filetype }}>
            {(signS3, { data, loading, error }) => (
              <div className="clearfix">
                <Upload
                  data={file => this.handleUpload(file, signS3, uploadPhoto)}
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
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
