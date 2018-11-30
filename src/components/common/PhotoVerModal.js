import React, { Component } from "react";
import { Modal, message, Upload, Button, Icon } from "antd";
import { SUBMIT_PHOTO_REVIEW, SIGNS3 } from "../../queries";
import { Mutation } from "react-apollo";
import axios from "axios";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

class PhotoVerModal extends Component {
  state = { photo: "", photoLoading: false, filename: "", filetype: "" };

  handleSubmit = submitPhotoReview => {
    submitPhotoReview()
      .then(({ data }) => {
        message.success("Photo submitted successfully");
        this.props.close();
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  handlePhotoChange = info => {
    if (info.fileList.length === 0) {
      this.setState({ photo: "" });
      message.success(`${info.file.name} file removed successfully.`);
      return;
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }

    let file = info.file;

    if (file.response) {
      return file.response.status === "success";
    }
  };

  handleUpload = (file, signS3) => {
    message.loading("Loading image. Please wait.");
    this.setState({
      filename: file.name,
      filetype: file.type,
      photoLoading: true
    });
    //format name on backend
    //filename: this.formatFilename(file.name),
    signS3()
      .then(async ({ data }) => {
        const { signedRequest, key } = data.signS3;
        await this.uploadToS3(file, signedRequest);
        this.setState({
          photo: key,
          photoLoading: false
        });
        message.success(`File uploaded successfully`);
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
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

  render() {
    const { visible, close, reason } = this.props;

    const { filename, filetype, photo, photoLoading } = this.state;

    return (
      <Mutation mutation={SIGNS3} variables={{ filename, filetype }}>
        {(signS3, { loading, error }) => {
          if (error) {
            message.error("Error uploading image. Please try again later");
          }
          return (
            <Mutation
              mutation={SUBMIT_PHOTO_REVIEW}
              variables={{
                photo,
                reason
              }}
            >
              {(submitPhotoReview, { loading }) => {
                if (loading) {
                  //TODO: Make nice popup saving
                  return <div>SAVING...</div>;
                }
                return (
                  <Modal
                    title={reason}
                    centered
                    visible={visible}
                    onOk={() => this.handleSubmit(submitPhotoReview)}
                    onCancel={close}
                    okButtonProps={{
                      disabled: photo === "" || loading
                    }}
                  >
                    <img
                      alt="upload"
                      style={{ width: "100%" }}
                      src={require("../../images/girl2.jpg")}
                    />
                    <p>
                      Photo verification shows members you are who you say you
                      are. Send us a picture making the same 'hand symbol' as
                      the picture above.
                    </p>
                    <p>
                      This picture will be used for verification purposes only
                      and will not be seen by others.
                    </p>
                    <p>Please give us 2-3 days to verify your photo.</p>
                    <div>
                      {" "}
                      <Upload
                        name="file"
                        customRequest={dummyRequest}
                        onChange={this.handlePhotoChange}
                        data={file => this.handleUpload(file, signS3)}
                      >
                        <Button disabled={photo !== "" || photoLoading}>
                          <Icon type="upload" /> Click to Upload
                        </Button>
                      </Upload>
                    </div>
                  </Modal>
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default PhotoVerModal;
