import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { SIGNS3, SUBMIT_PHOTO } from "queries";
import axios from "axios";
import PhotoUpload from "../../common/PhotoUpload";
import { withNamespaces } from "react-i18next";
import Modal from "../../common/Modal";

class PhotoVerify extends PureComponent {
  state = { photos: [], filename: "", filetype: "", photoKey: "" };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  setPhotos = photos => {
    if (this.mounted) {
      this.setState({ photos });
    }
  };

  handleUpload = async ({ signS3, submitPhoto }) => {
    const { photos } = this.state;
    if (photos.length === 0) {
      return;
    }

    const file = photos[0];

    await this.setS3PhotoParams(file.name, file.type);

    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key } = data.signS3;
        await this.uploadToS3(file, signedRequest);
        if (this.mounted) {
          this.setState({ photoKey: key });
        }
        await this.handleSubmit(submitPhoto);
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  handleSubmit = async submitPhoto => {
    await submitPhoto()
      .then(({ data }) => {
        this.props.close();
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  setS3PhotoParams = (name, type) => {
    if (this.mounted) {
      this.setState({
        filename: name,
        filetype: type
      });
    }
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
    const {
      close,
      type,
      t,
      ErrorHandler: { ErrorBoundary }
    } = this.props;
    const { photos, filename, filetype, photoKey } = this.state;
    let header, subheader, body, instruction, btnText;
    header = subheader = body = instruction = btnText = "";
    if (type === "verify") {
      header = t("Submit Photo Verification");
      subheader = t(
        "It is a long established fact that a reader will be distracted by the readable"
      );
      body = t(
        "Photo verification shows members you are who you say you are. Send us a picture making the same 'hand symbol' as the picture above. This picture will be used for verification purposes only and will not be seen by others."
      );

      instruction = t("Please give us 2-3 days to verify your photo…");
      btnText = t("Submit Verify");
    } else if (type === "std") {
      header = t("Submit STD Verification");
      subheader = t(
        "It is a long established fact that a reader will be distracted by the readable"
      );
      body = t(
        "Photo verification shows members you are who you say you are. Send us a picture making the same 'hand symbol' as the picture above. This picture will be used for verification purposes only and will not be seen by others."
      );
      instruction = t("Please give us 2-3 days to verify your photo…");
      btnText = t("Submit Verify");
    }
    return (
      <Modal
        header={header}
        close={close}
        description="Information sent for verification is not shared with anyone"
        okSpan={
          photos.length !== 0 ? (
            <Mutation
              mutation={SUBMIT_PHOTO}
              variables={{ reason: "std", photo: photoKey }}
            >
              {submitPhoto => {
                return (
                  <Mutation
                    mutation={SIGNS3}
                    variables={{ filename, filetype }}
                  >
                    {signS3 => {
                      return (
                        <div
                          className="greenButton"
                          onClick={() =>
                            this.handleUpload({
                              signS3,
                              submitPhoto
                            })
                          }
                        >
                          <span>{btnText}</span>
                        </div>
                      );
                    }}
                  </Mutation>
                );
              }}
            </Mutation>
          ) : null
        }
      >
        <ErrorBoundary>
          <div className="m-body">
            <div className="verify-account">
              <div
                className="example-image"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "20px"
                }}
              >
                <img src="assets/img/elements/example-verify.png" alt="" />
              </div>
              <span className="instructions">
                {body}
                <br />
                <br />
                {instruction}
              </span>
              <div className="upload-verify">
                <PhotoUpload photos={photos} setPhotos={this.setPhotos} />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </Modal>
    );
  }
}

export default withNamespaces("modals")(PhotoVerify);
