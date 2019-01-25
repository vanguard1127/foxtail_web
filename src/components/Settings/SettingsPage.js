import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { UPDATE_SETTINGS, SIGNS3 } from "../../queries";

import { toast } from "react-toastify";
import ImageEditor from "../Modals/ImageEditor";

import ProfilePic from "./ProfilePic";
import Photos from "./Photos";
import Menu from "./Menu";
import Preferences from "./Preferences";
import AppSettings from "./AppSettings";
import Verifications from "./Verifications";
import MyProfile from "./MyProfile";
import DesiresModal from "../Modals/Desires/Modal";
import SubmitPhotoModal from "../Modals/SubmitPhoto";
import CoupleModal from "../Modals/Couples";
import BlackModal from "../Modals/Black";
import axios from "axios";

class SettingsPage extends Component {
  //TODO: Do we need to have these setup?
  state = {
    distance: 100,
    distanceMetric: "mi",
    ageRange: [18, 80],
    interestedIn: ["M", "F"],
    location: "",
    visible: true,
    newMsgNotify: true,
    lang: "en",
    emailNotify: true,
    showOnline: true,
    likedOnly: false,
    vibrateNotify: false,
    couplePartner: null,
    users: null,
    publicPics: this.props.settings.photos.filter(
      x => !x.private && x.url !== ""
    ),
    privatePics: this.props.settings.photos.filter(
      x => x.private && x.url !== ""
    ),
    about: null,
    desires: [],
    showDesiresPopup: false,
    showPhotoVerPopup: false,
    showBlackPopup: false,
    showImgEditorPopup: false,
    showCouplePopup: false,
    photoSubmitType: "",
    includeMsgs: false,
    fileRecieved: null,
    isPrivate: false,
    filename: "",
    filetype: "",
    profilePic: "",
    profilePicUrl: "",
    flashCpl: false,
    ...this.props.settings,
    publicPhotoList: undefined,
    privatePhotoList: undefined
  };

  // componentDidUpdate(prevProps, prevState) {
  //   //set it if different.after save revert to undefined
  //   console.log(
  //     this.state.publicPhotoList,
  //     "MMMMMM",
  //     prevState.publicPhotoList
  //   );
  //   if (this.state.publicPhotoList !== prevState.publicPhotoList) {
  //     console.log("UPDATE");
  //   }
  // }

  handlePhotoListChange = ({
    file,
    key,
    url,
    isPrivate,
    isDeleted,
    updateSettings
  }) => {
    if (isPrivate) {
      let { privatePics } = this.state;

      if (isDeleted) {
        privatePics = privatePics.filter(x => x.id !== file.id);
      } else {
        privatePics.push({
          uid: Date.now(),
          key,
          url
        });
      }
      this.setState(
        {
          privatePics,
          publicPhotoList: undefined,
          privatePhotoList: privatePics.map(file => JSON.stringify(file))
        },
        () => this.handleSubmit(updateSettings, true)
      );
    } else {
      let { publicPics, profilePic } = this.state;

      if (isDeleted) {
        publicPics = publicPics.filter(x => x.id !== file.id);
      } else {
        publicPics.push({
          uid: Date.now(),
          key,
          url
        });
        if (profilePic === "") {
          this.setProfilePic({ key, url, updateSettings });
        }
      }

      this.setState(
        {
          publicPics,
          privatePhotoList: undefined,
          publicPhotoList: publicPics.map(file => JSON.stringify(file))
        },
        () => this.handleSubmit(updateSettings, true)
      );
    }
  };

  handleSubmit = (updateSettings, saveImage) => {
    if (!saveImage) {
      this.setState(
        {
          privatePhotoList: undefined,
          publicPhotoList: undefined
        },
        () => {
          updateSettings()
            .then(({ data }) => {
              if (data.updateSettings) {
                if (this.props.isCouple && this.props.isInitial) {
                  this.setState({ flashCpl: true });
                }
              }
            })
            .then(() => this.props.refetchUser())
            .catch(res => {
              console.log(res);
              const errors = res.graphQLErrors.map(error => {
                return error.message;
              });

              //TODO: send errors to analytics from here
              this.setState({ errors });
            });
        }
      );
    } else {
      updateSettings()
        .then(({ data }) => {
          if (data.updateSettings) {
            if (this.props.isCouple && this.props.isInitial) {
              this.setState({ flashCpl: true });
            }
          }
        })
        .then(() => this.props.refetchUser())
        .catch(res => {
          console.log(res);

          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    }
    //TODO:REfetchs
    console.log(this.props);
  };

  setLocationValues = ({ lat, long, address, updateSettings }) => {
    if (lat && long) {
      this.setState({ lat, long, location: address }, () =>
        this.handleSubmit(updateSettings)
      );
    } else {
      this.setState({ location: address }, () =>
        this.handleSubmit(updateSettings)
      );
    }
  };

  toggleDesires = ({ checked, value }, updateSettings) => {
    const { desires } = this.state;

    if (checked) {
      this.setState({ desires: [...desires, value] }, () =>
        this.handleSubmit(updateSettings)
      );
    } else {
      this.setState(
        { desires: desires.filter(desire => desire !== value) },
        () => this.handleSubmit(updateSettings)
      );
    }
  };

  setValue = ({ name, value, updateSettings }) => {
    this.setState({ [name]: value }, () => this.handleSubmit(updateSettings));
  };

  setProfilePic = ({ key, url, updateSettings }) => {
    this.setState({ profilePic: key, profilePicUrl: url }, () => {
      this.handleSubmit(updateSettings);
    });
  };

  toggleDesiresPopup = () => {
    this.setState({
      showDesiresPopup: !this.state.showDesiresPopup
    });
  };

  toggleImgEditorPopup = (file, isPrivate) => {
    this.setState(
      {
        fileRecieved: file,
        isPrivate
      },
      () => {
        this.setState({
          showImgEditorPopup: !this.state.showImgEditorPopup
        });
      }
    );
  };

  togglePhotoVerPopup = () => {
    this.setState({
      showPhotoVerPopup: !this.state.showPhotoVerPopup
    });
  };

  toggleCouplesPopup = () => {
    this.setState({
      showCouplePopup: !this.state.showCouplePopup
    });
  };

  toggleBlackPopup = () => {
    this.setState({
      showBlackPopup: !this.state.showBlackPopup
    });
  };

  openPhotoVerPopup = type => {
    this.setState({ photoSubmitType: type }, () => this.togglePhotoVerPopup());
  };

  setPartnerID = id => {
    this.props.form.setFieldsValue({ couplePartner: id });
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
    const {
      location,
      visible,
      emailNotify,
      showOnline,
      likedOnly,
      vibrateNotify,
      distance,
      distanceMetric,
      ageRange,
      interestedIn,
      users,
      publicPhotoList,
      privatePhotoList,
      publicPics,
      privatePics,
      about,
      desires,
      showPhotoVerPopup,
      showDesiresPopup,
      photoSubmitType,
      showImgEditorPopup,
      showCouplePopup,
      showBlackPopup,
      couplePartner,
      includeMsgs,
      lang,
      fileRecieved,
      filename,
      filetype,
      isPrivate,
      profilePic,
      profilePicUrl,
      flashCpl
    } = this.state;

    const { userID, t } = this.props;
    let aboutErr = "";
    if (about === "") {
      aboutErr = "Please fill in your bio";
    } else if (about.length < 10) {
      aboutErr = "Bio must be more than 20 characters";
    }

    const errors = {
      profilePic:
        publicPics.length === 0 ? "Please upload at least 1 photo" : null,
      about: aboutErr !== "" ? aboutErr : null,
      desires: desires.length === 0 ? "Please select at least 1 desire" : null
    };

    return (
      <Mutation
        mutation={UPDATE_SETTINGS}
        variables={{
          distance,
          distanceMetric,
          ageRange,
          interestedIn,
          location,
          visible,
          lang,
          emailNotify,
          showOnline,
          likedOnly,
          vibrateNotify,
          users,
          publicPhotoList,
          privatePhotoList,
          about,
          desires,
          couplePartner,
          includeMsgs,
          profilePic
        }}
      >
        {(updateSettings, { loading }) => {
          return (
            <section className="settings">
              <div className="container">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12 col-lg-3">
                      <div className="sidebar">
                        <ProfilePic profilePic={profilePicUrl} />
                        <Menu
                          coupleModalToggle={this.toggleCouplesPopup}
                          couplePartner={couplePartner}
                          blackModalToggle={this.toggleBlackPopup}
                          t={t}
                          flashCpl={flashCpl}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-lg-9">
                      <div className="page mtop">
                        <div className="form">
                          <Preferences
                            values={{
                              distance,
                              distanceMetric,
                              ageRange,
                              interestedIn,
                              location
                            }}
                            setValue={({ name, value }) =>
                              this.setValue({ name, value, updateSettings })
                            }
                            setLocationValues={({ lat, long, address }) =>
                              this.setLocationValues({
                                lat,
                                long,
                                address,
                                updateSettings
                              })
                            }
                            t={t}
                          />
                          <Photos
                            isPrivate={false}
                            showEditor={this.toggleImgEditorPopup}
                            photos={publicPics}
                            setProfilePic={({ key, url }) =>
                              this.setProfilePic({
                                key,
                                url,
                                updateSettings
                              })
                            }
                            deleteImg={({ file, key }) =>
                              this.handlePhotoListChange({
                                file,
                                key,
                                isPrivate: false,
                                isDeleted: true,
                                updateSettings
                              })
                            }
                            t={t}
                          />

                          {errors.profilePic && (
                            <label className="errorLbl">
                              {errors.profilePic}
                            </label>
                          )}
                          <Photos
                            isPrivate={true}
                            showEditor={this.toggleImgEditorPopup}
                            photos={privatePics}
                            deleteImg={({ file, key }) =>
                              this.handlePhotoListChange({
                                file,
                                key,
                                isPrivate: true,
                                isDeleted: true,
                                updateSettings
                              })
                            }
                            t={t}
                          />
                          <MyProfile
                            desires={desires}
                            about={about}
                            togglePopup={this.toggleDesiresPopup}
                            setValue={({ name, value }) =>
                              this.setValue({ name, value, updateSettings })
                            }
                            t={t}
                            errors={errors}
                          />
                          <AppSettings
                            setValue={({ name, value }) =>
                              this.setValue({ name, value, updateSettings })
                            }
                            values={{
                              visible,
                              lang,
                              emailNotify,
                              showOnline,
                              likedOnly
                            }}
                            t={t}
                          />
                          <Verifications
                            openPhotoVerPopup={this.openPhotoVerPopup}
                            t={t}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showImgEditorPopup && (
                <Mutation mutation={SIGNS3} variables={{ filename, filetype }}>
                  {signS3 => {
                    return (
                      <ImageEditor
                        file={fileRecieved}
                        handlePhotoListChange={({ file, key, url }) =>
                          this.handlePhotoListChange({
                            file,
                            key,
                            url,
                            isPrivate,
                            isDeleted: false,
                            updateSettings
                          })
                        }
                        setS3PhotoParams={this.setS3PhotoParams}
                        uploadToS3={this.uploadToS3}
                        signS3={signS3}
                        close={this.toggleImgEditorPopup}
                      />
                    );
                  }}
                </Mutation>
              )}

              {showDesiresPopup && (
                <DesiresModal
                  closePopup={() => this.toggleDesiresPopup()}
                  onChange={e => this.toggleDesires(e, updateSettings)}
                  desires={desires}
                  updateSettings={updateSettings}
                />
              )}
              {showPhotoVerPopup && (
                <SubmitPhotoModal
                  closePopup={() => this.togglePhotoVerPopup()}
                  type={photoSubmitType}
                />
              )}
              {showCouplePopup && (
                <CoupleModal
                  close={() => this.toggleCouplesPopup()}
                  setValue={({ name, value }) =>
                    this.setValue({ name, value, updateSettings })
                  }
                  username={couplePartner}
                  includeMsgs={includeMsgs}
                  setPartnerID={this.setPartnerID}
                />
              )}
              {showBlackPopup && (
                <BlackModal
                  close={() => this.toggleBlackPopup()}
                  userID={userID}
                  refetchUser={this.props.refetch}
                />
              )}
            </section>
          );
        }}
      </Mutation>
    );
  }
}

export default SettingsPage;
