import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { UPDATE_SETTINGS } from "../../queries";

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
    publicPhotoList: [],
    privatePhotoList: [],
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
    ...this.props.settings
  };

  handleSubmit = updateSettings => {
    updateSettings()
      .then(({ data }) => {
        if (data.updateSettings) {
          //  Message.success("Settings have been saved");
        } else {
          //Message.error("Error saving settings. Please contact support.");
        }
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
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

  toggleDesiresPopup = () => {
    this.setState({
      showDesiresPopup: !this.state.showDesiresPopup
    });
  };

  toggleImgEditorPopup = file => {
    console.log("file get", file);
    this.setState(
      {
        fileRecieved: file
      },
      () => {
        this.setState({
          showImgEditorPopup: !this.state.showImgEditorPopup
        });
      }
    );
  };

  recieveEditedImage = files => {
    console.log("recieved", files);
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

  savePics = ({ files, isPrivate }) => {
    if (isPrivate) {
      this.setState({
        privatePhotoList: files
      });
    } else {
      this.setState({
        publicPhotoList: files
      });
    }
  };

  setPartnerID = id => {
    this.props.form.setFieldsValue({ couplePartner: id });
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
      fileRecieved
    } = this.state;

    const { userID } = this.props;

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
          includeMsgs
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
                        <ProfilePic />
                        <Menu
                          coupleModalToggle={this.toggleCouplesPopup}
                          couplePartner={couplePartner}
                          blackModalToggle={this.toggleBlackPopup}
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
                          />
                          <Photos
                            isPrivate={false}
                            savePics={e =>
                              this.savePics({ files: e, isPrivate: false })
                            }
                            showEditor={this.toggleImgEditorPopup}
                          />
                          <Photos
                            isPrivate={true}
                            savePics={e =>
                              this.savePics({ files: e, isPrivate: true })
                            }
                            showEditor={this.toggleImgEditorPopup}
                          />
                          <MyProfile
                            desires={desires}
                            about={about}
                            togglePopup={this.toggleDesiresPopup}
                            setValue={({ name, value }) =>
                              this.setValue({ name, value, updateSettings })
                            }
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
                          />
                          <Verifications
                            openPhotoVerPopup={this.openPhotoVerPopup}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showImgEditorPopup && (
                <ImageEditor
                  file={fileRecieved}
                  handlePhotoListChange={this.recieveEditedImage}
                />
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
