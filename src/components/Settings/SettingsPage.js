import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import axios from 'axios';
import { UPDATE_SETTINGS, SIGNS3 } from '../../queries';
import ImageEditor from '../Modals/ImageEditor';
import ProfilePic from './ProfilePic';
import Photos from './Photos';
import Menu from './Menu';
import Preferences from './Preferences';
import AppSettings from './AppSettings';
import AcctSettings from './AcctSettings';
import Verifications from './Verifications';
import ManageBlackSub from './ManageBlackSub';
import MyProfile from './MyProfile';
import DesiresModal from '../Modals/Desires/Modal';
import SubmitPhotoModal from '../Modals/SubmitPhoto';
import CoupleModal from '../Modals/Couples';
import BlackModal from '../Modals/Black';
import getCityCountry from '../../utils/getCityCountry';

class SettingsPage extends PureComponent {
  //TODO: Do we need to have these setup?
  state = {
    distance: 100,
    distanceMetric: 'mi',
    ageRange: [18, 80],
    interestedIn: ['M', 'F'],
    city: '',
    country: '',
    visible: true,
    newMsgNotify: true,
    lang: 'en',
    emailNotify: true,
    showOnline: true,
    likedOnly: false,
    vibrateNotify: false,
    couplePartner: undefined,
    users: undefined,
    publicPics: this.props.settings.photos.filter(
      x => !x.private && x.url !== ''
    ),
    privatePics: this.props.settings.photos.filter(
      x => x.private && x.url !== ''
    ),
    about: undefined,
    desires: [],
    username: undefined,
    email: undefined,
    gender: undefined,
    phone: undefined,
    showDesiresPopup: false,
    showPhotoVerPopup: false,
    showBlackPopup: this.props.showBlkModal || false,
    showImgEditorPopup: false,
    showCouplePopup: this.props.showCplModal || false,
    photoSubmitType: '',
    includeMsgs: false,
    fileRecieved: undefined,
    isPrivate: false,
    filename: '',
    filetype: '',
    profilePic: '',
    profilePicUrl: '',
    flashCpl: false,
    ...this.props.settings,
    publicPhotoList: undefined,
    privatePhotoList: undefined
  };

  componentDidMount() {
    this.props.history.replace({ state: {} });
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handlePhotoListChange = ({
    file,
    key,
    url,
    isPrivate,
    isDeleted,
    updateSettings
  }) => {
    this.props.ErrorHandler.setBreadcrumb('Photo list updated');
    if (isPrivate) {
      let { privatePics } = this.state;

      if (isDeleted) {
        privatePics = privatePics.filter(x => x.id !== file.id);
      } else {
        privatePics = [
          ...privatePics,
          {
            uid: Date.now(),
            key,
            url
          }
        ];
      }
      if (this.mounted) {
        this.setState(
          {
            privatePics,
            publicPhotoList: undefined,
            privatePhotoList: privatePics.map(file => JSON.stringify(file))
          },
          () => this.handleSubmit(updateSettings, true)
        );
      }
    } else {
      let { publicPics, profilePic } = this.state;

      if (isDeleted) {
        if (profilePic === file.key) {
          if (this.mounted) {
            this.setState({ profilePic: '', profilePicUrl: '' });
          }
        }
        publicPics = publicPics.filter(x => x.id !== file.id);
      } else {
        publicPics = [
          ...publicPics,
          {
            uid: Date.now(),
            key,
            url
          }
        ];
        if (profilePic === '') {
          if (this.mounted) {
            this.setState({ profilePic: key, profilePicUrl: url });
          }
        }
      }
      if (this.mounted) {
        this.setState(
          {
            publicPics,
            privatePhotoList: undefined,
            publicPhotoList: publicPics.map(file => JSON.stringify(file))
          },
          () => this.handleSubmit(updateSettings, true)
        );
      }
    }
  };

  handleSubmit = (updateSettings, saveImage) => {
    this.props.ErrorHandler.setBreadcrumb('Settings updated');
    if (!saveImage) {
      if (this.mounted) {
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
                    if (this.mounted) {
                      this.setState({ flashCpl: true });
                    }
                  }
                }
              })
              .then(() => this.props.refetchUser())
              .catch(res => {
                this.props.ErrorHandler.catchErrors(res.graphQLErrors);
              });
          }
        );
      }
    } else {
      updateSettings()
        .then(({ data }) => {
          if (data.updateSettings) {
            if (this.props.isCouple && this.props.isInitial) {
              if (this.mounted) {
                this.setState({ flashCpl: true });
              }
            }
          }
        })
        .then(() => this.props.refetchUser())
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    }
  };

  setLocationValues = async ({ lat, long, city, updateSettings }) => {
    if (lat && long) {
      const citycntry = await getCityCountry({
        long,
        lat
      });

      if (this.mounted) {
        this.setState(
          {
            long,
            lat,
            city: citycntry.city,
            country: citycntry.country
          },
          () => this.handleSubmit(updateSettings)
        );
      }
    } else {
      if (this.mounted) {
        this.setState({ city });
      }
    }
  };

  toggleDesires = ({ checked, value }, updateSettings) => {
    const { desires } = this.state;
    if (this.mounted) {
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
    }
  };

  setValue = ({ name, value, updateSettings, noSave }) => {
    if (this.mounted) {
      this.setState({ [name]: value }, () => {
        if (noSave === true) {
          return;
        }

        this.handleSubmit(updateSettings);
      });
    }
  };

  setProfilePic = ({ key, url, updateSettings }) => {
    if (this.mounted) {
      this.setState({ profilePic: key, profilePicUrl: url }, () => {
        this.handleSubmit(updateSettings);
      });
    }
  };

  toggleDesiresPopup = () => {
    this.props.ErrorHandler.setBreadcrumb('Desires popup toggled');
    if (this.mounted) {
      this.setState({
        showDesiresPopup: !this.state.showDesiresPopup
      });
    }
  };

  toggleImgEditorPopup = (file, isPrivate) => {
    this.props.ErrorHandler.setBreadcrumb('Toggle image editor');
    if (this.mounted) {
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
    }
  };

  togglePhotoVerPopup = () => {
    this.props.ErrorHandler.setBreadcrumb('Toggle Photo Ver Popup');
    if (this.mounted) {
      this.setState({
        showPhotoVerPopup: !this.state.showPhotoVerPopup
      });
    }
  };

  toggleCouplesPopup = () => {
    this.props.ErrorHandler.setBreadcrumb('Toggle Couple popup');
    if (this.mounted) {
      this.setState({
        showCouplePopup: !this.state.showCouplePopup
      });
    }
  };

  toggleBlackPopup = () => {
    this.props.ErrorHandler.setBreadcrumb('Toggle Blk popup');
    if (this.mounted) {
      this.setState({
        showBlackPopup: !this.state.showBlackPopup
      });
    }
  };

  openPhotoVerPopup = type => {
    if (this.mounted) {
      this.setState({ photoSubmitType: type }, () =>
        this.togglePhotoVerPopup()
      );
    }
  };

  setPartnerID = id => {
    this.props.ErrorHandler.setBreadcrumb('Set Partner ID');
    this.props.form.setFieldsValue({ couplePartner: id });
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
    this.props.ErrorHandler.setBreadcrumb('Upload to S3');
    try {
      //ORIGINAL
      const options = {
        headers: {
          'Content-Type': file.type
        }
      };
      const resp = await axios.put(signedRequest, file, options);
      if (resp.status === 200) {
        console.log('upload ok');
      } else {
        console.log('Something went wrong');
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {
      lat,
      long,
      city,
      country,
      visible,
      emailNotify,
      showOnline,
      likedOnly,
      vibrateNotify,
      distance,
      distanceMetric,
      ageRange,
      interestedIn,
      email,
      username,
      gender,
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
      phone,
      flashCpl
    } = this.state;

    const { userID, t, ErrorHandler, currentuser, refetchUser } = this.props;

    let aboutErr = '';
    if (about === '') {
      aboutErr = 'Please fill in your bio';
    } else if (about.length < 20) {
      aboutErr = 'Bio must be more than 20 characters';
    }

    let profilePicErr = '';
    if (publicPics.length === 0) {
      profilePicErr = 'Please upload at least 1 photo';
    } else if (profilePic === '') {
      profilePicErr = 'Please select a Profile Picture';
    }

    const errors = {
      profilePic: profilePicErr !== '' ? profilePicErr : null,
      about: aboutErr !== '' ? aboutErr : null,
      desires: desires.length === 0 ? 'Please select at least 1 desire' : null
    };

    return (
      <Mutation
        mutation={UPDATE_SETTINGS}
        variables={{
          lat,
          long,
          distance,
          distanceMetric,
          ageRange,
          interestedIn,
          city,
          country,
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
          email,
          username,
          gender,
          phone,
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
                        <ErrorHandler.ErrorBoundary>
                          {' '}
                          <ProfilePic profilePic={profilePicUrl} />
                          <Menu
                            coupleModalToggle={this.toggleCouplesPopup}
                            couplePartner={couplePartner}
                            blackModalToggle={this.toggleBlackPopup}
                            t={t}
                            flashCpl={flashCpl}
                            currentuser={currentuser}
                            refetchUser={refetchUser}
                          />
                        </ErrorHandler.ErrorBoundary>
                      </div>
                    </div>
                    <div className="col-md-12 col-lg-9">
                      <div className="page mtop">
                        <div className="form">
                          <ErrorHandler.ErrorBoundary>
                            {' '}
                            <Preferences
                              distance={distance}
                              distanceMetric={distanceMetric}
                              ageRange={ageRange}
                              interestedIn={interestedIn}
                              city={city}
                              setValue={({ name, value }) =>
                                this.setValue({ name, value, updateSettings })
                              }
                              setLocationValues={({ lat, long, city }) =>
                                this.setLocationValues({
                                  lat,
                                  long,
                                  city,
                                  updateSettings
                                })
                              }
                              t={t}
                            />
                          </ErrorHandler.ErrorBoundary>
                          <ErrorHandler.ErrorBoundary>
                            {' '}
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
                          </ErrorHandler.ErrorBoundary>
                          {errors.profilePic && (
                            <label className="errorLbl">
                              {errors.profilePic}
                            </label>
                          )}
                          <ErrorHandler.ErrorBoundary>
                            {' '}
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
                          </ErrorHandler.ErrorBoundary>
                          <MyProfile
                            desires={desires}
                            about={about}
                            togglePopup={this.toggleDesiresPopup}
                            setValue={({ name, value, noSave }) =>
                              this.setValue({
                                name,
                                value,
                                updateSettings,
                                noSave
                              })
                            }
                            t={t}
                            errors={errors}
                            ErrorBoundary={ErrorHandler.ErrorBoundary}
                          />
                          <ErrorHandler.ErrorBoundary>
                            {' '}
                            <AppSettings
                              setValue={({ name, value }) =>
                                this.setValue({ name, value, updateSettings })
                              }
                              visible={visible}
                              lang={lang}
                              emailNotify={emailNotify}
                              showOnline={showOnline}
                              likedOnly={likedOnly}
                              t={t}
                              ErrorHandler={ErrorHandler}
                            />
                          </ErrorHandler.ErrorBoundary>
                          <ErrorHandler.ErrorBoundary>
                            <Verifications
                              openPhotoVerPopup={this.openPhotoVerPopup}
                              t={t}
                            />
                          </ErrorHandler.ErrorBoundary>
                          {currentuser.blackMember.active && (
                            <ErrorHandler.ErrorBoundary>
                              <ManageBlackSub
                                ErrorHandler={ErrorHandler}
                                currentuser={currentuser}
                                refetchUser={refetchUser}
                                t={t}
                              />
                            </ErrorHandler.ErrorBoundary>
                          )}
                          <ErrorHandler.ErrorBoundary>
                            {' '}
                            <AcctSettings
                              setValue={({ name, value }) =>
                                this.setValue({ name, value, updateSettings })
                              }
                              t={t}
                              ErrorHandler={ErrorHandler}
                            />
                          </ErrorHandler.ErrorBoundary>
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
                        ErrorHandler={ErrorHandler}
                      />
                    );
                  }}
                </Mutation>
              )}

              {showDesiresPopup && (
                <DesiresModal
                  close={this.toggleDesiresPopup}
                  onChange={e => this.toggleDesires(e, updateSettings)}
                  desires={desires}
                  updateSettings={updateSettings}
                  ErrorBoundary={ErrorHandler.ErrorBoundary}
                />
              )}
              {showPhotoVerPopup && (
                <SubmitPhotoModal
                  close={this.togglePhotoVerPopup}
                  type={photoSubmitType}
                  ErrorHandler={ErrorHandler}
                />
              )}
              {showCouplePopup && (
                <CoupleModal
                  close={this.toggleCouplesPopup}
                  setValue={({ name, value }) =>
                    this.setValue({ name, value, updateSettings })
                  }
                  username={couplePartner}
                  includeMsgs={includeMsgs}
                  setPartnerID={this.setPartnerID}
                  ErrorHandler={ErrorHandler}
                />
              )}
              {showBlackPopup && (
                <BlackModal
                  close={this.toggleBlackPopup}
                  userID={userID}
                  refetchUser={this.props.refetch}
                  ErrorBoundary={ErrorHandler.ErrorBoundary}
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
