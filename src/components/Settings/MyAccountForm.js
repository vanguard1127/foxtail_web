import React, { Component } from "react";
import Message from "rc-message";
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

class MyAccountForm extends Component {
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
    showPhotoSubPopup: false,
    showImgEditorPopup: false,
    photoSubmitType: "",
    ...this.props.settings
  };

  handleSubmit = updateSettings => {
    updateSettings()
      .then(({ data }) => {
        if (data.updateSettings) {
          Message.success("Settings have been saved");
        } else {
          Message.error("Error saving settings. Please contact support.");
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

  toggleDesires = ({ checked, value, updateSettings }) => {
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

  toggleImgEditorPopup = () => {
    this.setState({
      showImgEditorPopup: !this.state.showImgEditorPopup
    });
  };

  togglePhotoVerPopup = () => {
    this.setState({
      showPhotoSubPopup: !this.state.showPhotoSubPopup
    });
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

  render() {
    const {
      location,
      visible,
      newMsgNotify,
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
      showPhotoSubPopup,
      showDesiresPopup,
      photoSubmitType,
      showImgEditorPopup
    } = this.state;

    let { lang } = this.state;

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
          newMsgNotify,
          lang,
          emailNotify,
          showOnline,
          likedOnly,
          vibrateNotify,
          users,
          publicPhotoList,
          privatePhotoList,
          about,
          desires
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
                        <Menu />
                      </div>
                    </div>
                    <div className="col-md-12 col-lg-9">
                      <div className="page mtop">
                        <div className="form">
                          <Preferences
                            distance={distance}
                            updateSettings={updateSettings}
                            ageRange={ageRange}
                            interestedIn={interestedIn}
                            distanceMetric={distanceMetric}
                            location={location}
                            setValue={this.setValue}
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
                            updateSettings={updateSettings}
                            about={about}
                            showPopup={this.toggleDesiresPopup}
                            setValue={this.setValue}
                          />
                          <AppSettings setValue={this.setValue} />
                          <Verifications />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showImgEditorPopup && <ImageEditor />}
              {showDesiresPopup && (
                <DesiresModal
                  closePopup={() => this.toggleDesiresPopup()}
                  toggleDesires={this.toggleDesires}
                  desires={desires}
                  updateSettings={updateSettings}
                />
              )}
              {showPhotoSubPopup && (
                <SubmitPhotoModal
                  closePopup={() => this.togglePhotoVerPopup()}
                  type={photoSubmitType}
                />
              )}
            </section>
          );
        }}
      </Mutation>
    );
  }
}

export default MyAccountForm;
