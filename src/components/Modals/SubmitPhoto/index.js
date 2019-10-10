import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { SIGNS3, SUBMIT_PHOTO } from "../../../queries";
import axios from "axios";
import PhotoUpload from "../../common/PhotoUpload";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import { toast } from "react-toastify";

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
        toast.success(this.props.t("verok"));
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
      if (resp.status !== 200) {
        toast.error(this.props.t("uploadissue"));
      }
    } catch (e) {
      this.props.ErrorHandler.catchErrors(e);
    }
  };

  render() {
    const {
      close,
      type,
      t,
      tReady,
      ErrorHandler: { ErrorBoundary }
    } = this.props;
    const { photos, filename, filetype, photoKey } = this.state;

    if (!tReady) {
      return null;
    }

    let header, body, instruction, btnText;
    header = body = instruction = btnText = "";
    if (type === "verify") {
      header = t("subphotover");

      body = t("photoverbody");

      instruction = t("verinstr");
      btnText = t("verbtn");
    } else if (type === "std") {
      header = t("substdver");

      body = t("substdverbody");
      instruction = t("verinstr");
      btnText = t("verbtn");
    }
    return (
      <Modal
        header={header}
        close={close}
        description={t("verpolicy")}
        className="verifications"
        okSpan={
          photos.length !== 0 ? (
            <Mutation
              mutation={SUBMIT_PHOTO}
              variables={{ type, image: photoKey }}
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
              {type === "verify" && (
                <div className="example-image">
                  <img
                    src={
                      process.env.REACT_APP_S3_AD_BUCKET_URL +
                      "selfie-peace.jpg"
                    }
                    alt=""
                  />
                </div>
              )}
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

export default withTranslation("modals")(PhotoVerify);
