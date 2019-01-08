import React, { Component } from "react";
import Message from "rc-message";
import { Mutation } from "react-apollo";
import { UPDATE_SETTINGS } from "../../queries";
import DistanceSlider from "../common/DistanceSlider";
import InterestedInDropdown from "../common/InterestedInDropdown";
import AgeRange from "../common/AgeRange";
import AddressSearch from "../common/AddressSearch";
import DesiresSelector from "../Modals/Desires/Selector";
import ImageEditor from "../Modals/ImageEditor";

import UploadComponent from "./UploadImageComponent";
import DesiresModal from "../Modals/Desires/Modal";
import SubmitPhotoModal from "../Modals/SubmitPhoto";
const milesToKilometers = miles => miles / 0.621371;
const kilometersToMiles = kilometers => kilometers * 0.621371;
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

  SavePublicImgs = files => {
    this.setState({
      publicPhotoList: files
    });
  };
  SavePrivateImgs = files => {
    this.setState({
      privatePhotoList: files
    });
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

    const initialDistanceMetric = distanceMetric;

    const convertFunction =
      "mi" === distanceMetric ? kilometersToMiles : milesToKilometers;
    // The input uses original metric
    // But displays and sends the selected metric
    let convertedDistance = distance;
    if (distanceMetric !== initialDistanceMetric) {
      convertedDistance = Math.floor(convertFunction(distance));
    }
    let { lang } = this.state;
    return (
      <Mutation
        mutation={UPDATE_SETTINGS}
        variables={{
          distance: convertedDistance,
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
          // The input always uses the first metric it was given
          // And sends a transformed metric if the user changed it
          const initialDistanceSliderMax =
            initialDistanceMetric === "mi"
              ? 100
              : Math.floor(milesToKilometers(100));

          const distanceSliderMax =
            distanceMetric === "mi" ? 100 : Math.floor(milesToKilometers(100));
          return (
            <section className="settings">
              <div className="container">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12 col-lg-3">
                      <div className="sidebar">
                        <div className="profile-picture-content">
                          <div className="picture">
                            <input
                              type="file"
                              className="filepond upload-avatar"
                              name="filepond"
                            />
                          </div>
                        </div>

                        <div className="menu">
                          <ul>
                            <li className="active">
                              <a href="#">My Account</a>
                            </li>
                            <li>
                              <a href="#">Add Couple Partner</a>
                            </li>
                            <li>
                              <a href="#">Become a Black Member</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-lg-9">
                      <div className="page mtop">
                        <div className="form">
                          <div className="content">
                            <div className="row">
                              <div className="col-md-12">
                                <span className="heading">
                                  My Search Preferences
                                </span>
                              </div>
                              <div className="col-md-6">
                                <DistanceSlider
                                  value={distance}
                                  setValue={el =>
                                    this.setValue({
                                      name: "distance",
                                      value: el,
                                      updateSettings
                                    })
                                  }
                                />
                              </div>
                              <div className="col-md-6">
                                <AgeRange
                                  value={ageRange}
                                  setValue={el =>
                                    this.setValue({
                                      name: "ageRange",
                                      value: el,
                                      updateSettings
                                    })
                                  }
                                />
                              </div>

                              <div className="col-md-12">
                                <div className="item">
                                  <div className="dropdown">
                                    <select
                                      className="js-example-basic-single"
                                      name="states[]"
                                      value={distanceMetric}
                                      onChange={e =>
                                        this.setValue({
                                          name: "distanceMetric",
                                          value: e.target.value,
                                          updateSettings
                                        })
                                      }
                                    >
                                      <option value="mi">Mile</option>
                                      <option value="km">KM</option>
                                    </select>
                                    <label>Distance Metric</label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <InterestedInDropdown
                                  setValue={el =>
                                    this.setValue({
                                      name: "interestedIn",
                                      value: el,
                                      updateSettings
                                    })
                                  }
                                  value={interestedIn}
                                  placeholder={"Gender(s):"}
                                />
                              </div>
                              <div className="col-md-6">
                                <div className="item">
                                  <AddressSearch
                                    style={{ width: 150 }}
                                    setLocationValues={({
                                      lat,
                                      long,
                                      address
                                    }) =>
                                      this.setLocationValues({
                                        lat,
                                        long,
                                        address,
                                        updateSettings
                                      })
                                    }
                                    address={location}
                                    type={"(cities)"}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="content mtop">
                            <div className="row">
                              <div className="col-md-12">
                                <span className="heading">
                                  Public Photos <i>(No nudity please)</i>
                                </span>
                              </div>
                              <div className="col-md-12">
                                <UploadComponent
                                  max={4}
                                  recieveImgs={this.SavePublicImgs}
                                  showEditor={this.toggleImgEditorPopup}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="content mtop">
                            <div className="row">
                              <div className="col-md-12">
                                <span className="heading">
                                  Private Photos{" "}
                                  <i>
                                    - (Nudity is OK. Will only show to matches.)
                                  </i>
                                </span>
                              </div>
                              <div className="col-md-12">
                                <UploadComponent
                                  max={4}
                                  recieveImgs={this.SavePrivateImgs}
                                  showEditor={this.toggleImgEditorPopup}
                                />
                                >
                              </div>
                            </div>
                          </div>
                          <div className="content">
                            <div className="row">
                              <div className="col-md-12">
                                <span className="heading">My Profile</span>
                              </div>
                              <div className="col-md-12">
                                <div className="item">
                                  <DesiresSelector
                                    togglePopup={this.toggleDesiresPopup}
                                    desires={desires}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="item">
                                  <div className="textarea">
                                    <textarea
                                      onChange={e =>
                                        this.setValue({
                                          name: "about",
                                          value: e.target.value,
                                          updateSettings
                                        })
                                      }
                                      value={about}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="content mtop">
                            <div className="row">
                              <div className="col-md-12">
                                <span className="heading">
                                  Verifications{" "}
                                  <i>- (Verified members get more responses)</i>
                                </span>
                              </div>
                              <div className="col-md-6">
                                <div className="verification-box">
                                  <span className="head">
                                    Photo Verification
                                  </span>
                                  <span className="title">
                                    It is a long established fact that a reader
                                    will be…
                                  </span>
                                  <a
                                    href="#"
                                    className="clickverify-btn photo"
                                    onClick={() =>
                                      this.setState(
                                        { photoSubmitType: "verify" },
                                        () => this.togglePhotoVerPopup()
                                      )
                                    }
                                  >
                                    Click Verification
                                  </a>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="verification-box">
                                  <span className="head">STD Verification</span>
                                  <span className="title">
                                    It is a long established fact that a reader
                                    will be…
                                  </span>
                                  <a
                                    href="#"
                                    className="clickverify-btn"
                                    onClick={() =>
                                      this.setState(
                                        { photoSubmitType: "std" },
                                        () => this.togglePhotoVerPopup()
                                      )
                                    }
                                  >
                                    Click Verification
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {showImgEditorPopup && <ImageEditor />}
              {showDesiresPopup ? (
                <DesiresModal
                  closePopup={() => this.toggleDesiresPopup()}
                  toggleDesires={this.toggleDesires}
                  desires={desires}
                  updateSettings={updateSettings}
                />
              ) : null}
              {showPhotoSubPopup ? (
                <SubmitPhotoModal
                  closePopup={() => this.togglePhotoVerPopup()}
                  type={photoSubmitType}
                />
              ) : null}
            </section>
          );
        }}
      </Mutation>
    );
  }
}

export default MyAccountForm;
