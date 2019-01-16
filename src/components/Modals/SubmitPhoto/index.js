import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { SIGNS3, SUBMIT_PHOTO } from "queries";
import axios from "axios";
import PhotoUpload from "../../common/PhotoUpload";
import { withNamespaces } from "react-i18next";

class PhotoVerify extends Component {
  state = { photos: [], filename: "", filetype: "", photoKey: "" };
  setPhotos = photos => {
    this.setState({ photos });
  };

  //TODO: Are all of these async await needed?
  handleUpload = async ({ signS3, submitPhoto }) => {
    const { photos } = this.state;
    if (photos.length === 0) {
      return;
    }

    const file = photos[0];

    await this.setS3PhotoParams(file.name, file.type);
    //format name on backend
    //filename: this.formatFilename(file.name),
    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key } = data.signS3;
        await this.uploadToS3(file, signedRequest);
        this.setState({ photoKey: key });
        await this.handleSubmit(submitPhoto);
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  handleSubmit = async submitPhoto => {
    await submitPhoto()
      .then(({ data }) => {
        this.props.closePopup();
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

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

  render() {
    const { closePopup, type, t } = this.props;
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
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup photo-verification">
                  <div className="m-head">
                    <span className="heading">{header}</span>
                    <span className="title">{subheader}</span>
                    <span className="close" onClick={closePopup} />
                  </div>
                  <div className="m-body">
                    <div className="verify-account">
                      <div className="example-image">
                        <img
                          src="assets/img/elements/example-verify.png"
                          alt=""
                        />
                      </div>
                      <span className="description">
                        {body}
                        <br />
                        <br />
                        {instruction}
                      </span>
                      <div className="upload-verify">
                        <PhotoUpload
                          photos={photos}
                          setPhotos={this.setPhotos}
                        />
                      </div>{" "}
                      {photos.length !== 0 ? (
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
                                      className="submit"
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
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withNamespaces()(PhotoVerify);
