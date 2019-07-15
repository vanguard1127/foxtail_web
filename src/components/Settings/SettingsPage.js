import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import axios from "axios";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from "body-scroll-lock";
import { UPDATE_SETTINGS, SIGNS3 } from "../../queries";
import ImageEditor from "../Modals/ImageEditor";
import ImageCropper from "../Modals/ImageCropper";
import ProfilePic from "./ProfilePic";
import Photos from "./Photos/";
import Menu from "./Menu/";
import Preferences from "./Preferences/";
import AppSettings from "./AppSettings";
import AcctSettings from "./AcctSettings/";
import Verifications from "./Verifications";
import ManageBlkMembership from "./ManageBlkMembership/";
import MyProfile from "./MyProfile/";
import DesiresModal from "../Modals/Desires/Modal";
import ShareModal from "../Modals/Share";
import SubmitPhotoModal from "../Modals/SubmitPhoto";
import CoupleModal from "../Modals/Couples";
import BlackModal from "../Modals/Black";
import getCityCountry from "../../utils/getCityCountry";
import DeactivateAcctBtn from "../common/DeactivateAcctBtn";
import Modal from "../common/Modal";
import deleteFromCache from "../../utils/deleteFromCache";
import { toast } from "react-toastify";

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.targetElement = React.createRef();
  }

  state = {
    distance: 100,
    distanceMetric: "mi",
    ageRange: [18, 80],
    interestedIn: ["M", "F"],
    city: "",
    country: "",
    visible: true,
    newMsgNotify: true,
    lang: "en",
    emailNotify: true,
    showOnline: true,
    likedOnly: false,
    vibrateNotify: false,
    couplePartner: undefined,
    users: undefined,
    publicPhotos: this.props.settings.publicPhotos,
    privatePhotos: this.props.settings.privatePhotos,
    about: undefined,
    desires: [],
    username: undefined,
    email: undefined,
    sexuality: "",
    gender: undefined,
    phone: undefined,
    showDesiresPopup: false,
    showPhotoVerPopup: false,
    showBlackPopup: this.props.showBlkModal || false,
    showImgEditorPopup: false,
    showImgCropperPopup: false,
    showSharePopup: false,
    showCouplePopup: this.props.showCplModal || false,
    photoSubmitType: "",
    includeMsgs: false,
    fileRecieved: undefined,
    isPrivate: false,
    filename: "",
    filetype: "",
    profilePic: "",
    profilePicUrl: "",
    flashCpl: false,
    ...this.props.settings,
    publicPhotoList: undefined,
    privatePhotoList: undefined,
    showModal: false,
    msg: "",
    btnText: "",
    title: "",
    okAction: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.currentuser !== nextProps.currentuser ||
      this.state.about !== nextState.about ||
      this.state.ageRange !== nextState.ageRange ||
      this.state.btnText !== nextState.btnText ||
      this.state.city !== nextState.city ||
      this.state.country !== nextState.country ||
      this.state.couplePartner !== nextState.couplePartner ||
      this.state.desires !== nextState.desires ||
      this.state.distance !== nextState.distance ||
      this.state.distanceMetric !== nextState.distanceMetric ||
      this.state.email !== nextState.email ||
      this.state.emailNotify !== nextState.emailNotify ||
      this.state.fileRecieved !== nextState.fileRecieved ||
      this.state.filename !== nextState.filename ||
      this.state.filetype !== nextState.filetype ||
      this.state.flashCpl !== nextState.flashCpl ||
      this.state.sexuality !== nextState.sexuality ||
      this.state.gender !== nextState.gender ||
      this.state.includeMsgs !== nextState.includeMsgs ||
      this.state.interestedIn !== nextState.interestedIn ||
      this.state.isPrivate !== nextState.isPrivate ||
      this.state.lang !== nextState.lang ||
      this.state.lastActive !== nextState.lastActive ||
      this.state.likedOnly !== nextState.likedOnly ||
      this.state.msg !== nextState.msg ||
      this.state.newMsgNotify !== nextState.newMsgNotify ||
      this.state.okAction !== nextState.okAction ||
      this.state.phone !== nextState.phone ||
      this.state.photoSubmitType !== nextState.photoSubmitType ||
      this.state.publicPhotos !== nextState.publicPhotos ||
      this.state.privatePhotos !== nextState.privatePhotos ||
      this.state.profilePic !== nextState.profilePic ||
      this.state.profilePicUrl !== nextState.profilePicUrl ||
      this.state.publicPhotoList !== nextState.publicPhotoList ||
      this.state.privatePhotoList !== nextState.privatePhotoList ||
      this.state.showBlackPopup !== nextState.showBlackPopup ||
      this.state.showSharePopup !== nextState.showSharePopup ||
      this.state.showCouplePopup !== nextState.showCouplePopup ||
      this.state.showDesiresPopup !== nextState.showDesiresPopup ||
      this.state.showImgEditorPopup !== nextState.showImgEditorPopup ||
      this.state.showImgCropperPopup !== nextState.showImgCropperPopup ||
      this.state.showModal !== nextState.showModal ||
      this.state.showOnline !== nextState.showOnline ||
      this.state.showPhotoVerPopup !== nextState.showPhotoVerPopup ||
      this.state.title !== nextState.title ||
      this.state.username !== nextState.username ||
      this.state.users !== nextState.users ||
      this.state.vibrateNotify !== nextState.vibrateNotify ||
      this.state.visible !== nextState.visible ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    const { history } = this.props;
    history.replace({ state: {} });
    window.addEventListener("beforeunload", async () => {
      await this.saveSettings();
    });
    window.addEventListener("unload", this.logData, false);

    this.mounted = true;
  }

  async componentWillUnmount() {
    await this.saveSettings();
    this.mounted = false;
  }

  async saveSettings() {
    const { ErrorHandler, isCouple, isInitial, refetchUser, t } = this.props;
    clearAllBodyScrollLocks();
    await this.updateSettings()
      .then(({ data }) => {
        if (data.updateSettings) {
          if (isCouple && isInitial && !this.state.flashCpl) {
            if (!toast.isActive("clickcpl")) {
              toast(t("clickcpl"), {
                toastId: "clickcpl"
              });
            }
          }
        }
      })
      .then(() => {
        this.clearUserData();
        refetchUser();
      })
      .catch(res => {
        ErrorHandler.catchErrors(res.graphQLErrors);
      });
  }

  clearUserData = () => {
    const { cache } = this.props.client;
    console.log(cache);
    deleteFromCache({ cache, query: "currentuser" });
  };

  handlePhotoListChange = ({
    file,
    key,
    url,
    isPrivate,
    isDeleted,
    updateSettings
  }) => {
    const { t } = this.props;
    this.setErrorHandler("Photo list updated");
    if (isPrivate) {
      let { privatePhotos } = this.state;

      if (isDeleted) {
        privatePhotos = privatePhotos.filter(x => x.id !== file.id);

        this.setState({ showModal: false });
        toast.success(t("photodel"));
      } else {
        privatePhotos = [
          ...privatePhotos,
          {
            uid: Date.now(),
            key,
            url
          }
        ];
      }
      if (this.mounted) {
        this.setState({
          privatePhotos,
          publicPhotoList: undefined,
          privatePhotoList: privatePhotos.map(file => JSON.stringify(file))
        });
      }
    } else {
      let { publicPhotos } = this.state;

      if (isDeleted) {
        publicPhotos = publicPhotos.filter(x => x.id !== file.id);
        this.setState({ showModal: false });
        toast.success(t("photodel"));
      } else {
        publicPhotos = [
          ...publicPhotos,
          {
            uid: Date.now(),
            key,
            url
          }
        ];
      }
      if (this.mounted) {
        this.setState({
          publicPhotos,
          privatePhotoList: undefined,
          publicPhotoList: publicPhotos.map(file => JSON.stringify(file))
        });
      }
    }
  };

  //Must reset these to prevent override on save
  resetAcctSettingState = () => {
    if (this.mounted) {
      this.setState({
        username: undefined,
        email: undefined,
        gender: undefined,
        phone: undefined
      });
    }
  };
  handleSubmit = (updateSettings, saveImage) => {
    const {
      ErrorHandler,
      isCouple,
      isInitial,
      refetchUser,
      t,
      ReactGA
    } = this.props;

    this.setErrorHandler("Settings updated...");
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
                  if (isCouple && isInitial && !this.state.flashCpl) {
                    if (!toast.isActive("clickcpl")) {
                      toast(t("clickcpl"), {
                        toastId: "clickcpl"
                      });
                    }
                    if (this.mounted) this.setState({ flashCpl: true });
                    ReactGA.event({
                      category: "Settings",
                      action: "Updated"
                    });
                  }
                }
              })
              .then(() => {
                this.resetAcctSettingState();
                refetchUser();
              })
              .catch(res => {
                this.resetAcctSettingState();
                ErrorHandler.catchErrors(res.graphQLErrors);
              });
          }
        );
      }
    } else {
      updateSettings()
        .then(({ data }) => {
          if (data.updateSettings) {
            ReactGA.event({
              category: "Settings",
              action: "Updated"
            });
            if (isCouple && isInitial) {
              if (this.mounted) this.setState({ flashCpl: true });
            }
          }
        })
        .then(() => {
          this.resetAcctSettingState();
          refetchUser();
        })
        .catch(res => {
          this.resetAcctSettingState();
          ErrorHandler.catchErrors(res.graphQLErrors);
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
      if (this.mounted) this.setState({ city });
    }
  };

  toggleDesires = ({ checked, value }, updateSettings) => {
    const { desires } = this.state;
    if (this.mounted) {
      if (checked) {
        this.setState({ desires: [...desires, value] });
      } else {
        this.setState({ desires: desires.filter(desire => desire !== value) });
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

  setErrorHandler = message => {
    const { ErrorHandler } = this.props;
    ErrorHandler.setBreadcrumb(message);
  };

  setProfilePic = ({ key, url, updateSettings }) => {
    if (this.mounted) {
      this.setState({ profilePic: key, profilePicUrl: url });
    }
  };

  toggleScroll(enabled) {
    enabled
      ? disableBodyScroll(this.targetElement)
      : enableBodyScroll(this.targetElement);
  }

  toggleDesiresPopup = () => {
    this.setErrorHandler("Desires popup toggled");
    if (this.mounted) {
      this.setState(
        {
          showDesiresPopup: !this.state.showDesiresPopup
        },
        this.toggleScroll(!this.state.showDesiresPopup)
      );
    }
  };

  toggleImgEditorPopup = (file, isPrivate) => {
    this.setErrorHandler("Toggle image editor");
    if (this.mounted) {
      this.setState(
        {
          fileRecieved: file,
          isPrivate,
          showImgEditorPopup: !this.state.showImgEditorPopup
        },
        this.toggleScroll(!this.state.showImgEditorPopup)
      );
    }
  };

  toggleImgCropperPopup = url => {
    this.setErrorHandler("Toggle image cropper");

    if (this.mounted) {
      this.setState(
        {
          fileRecieved: url,
          showImgCropperPopup: !this.state.showImgCropperPopup
        },
        this.toggleScroll(!this.state.showImgCropperPopup)
      );
    }
  };

  togglePhotoVerPopup = () => {
    this.setErrorHandler("Toggle Photo Ver Popup");
    if (this.mounted) {
      this.setState(
        {
          showPhotoVerPopup: !this.state.showPhotoVerPopup
        },
        this.toggleScroll(!this.state.showPhotoVerPopup)
      );
    }
  };

  toggleCouplesPopup = () => {
    this.setErrorHandler("Toggle Couple popup");
    if (this.mounted) {
      this.setState(
        {
          showCouplePopup: !this.state.showCouplePopup,
          flashCpl: false
        },
        this.toggleScroll(!this.state.showCouplePopup)
      );
    }
  };

  toggleBlackPopup = () => {
    this.setErrorHandler("Toggle Blk popup");
    if (this.mounted) {
      this.setState(
        {
          showBlackPopup: !this.state.showBlackPopup
        },
        this.toggleScroll(!this.state.showBlackPopup)
      );
    }
  };

  toggleSharePopup = () => {
    this.setErrorHandler("Toggle Share popup");
    if (this.mounted) {
      this.setState(
        {
          showSharePopup: !this.state.showSharePopup
        },
        this.toggleScroll(!this.state.showSharePopup)
      );
    }
  };

  notifyClient = text => {
    toast.success(text);
  };
  openPhotoVerPopup = type => {
    if (this.mounted) {
      this.setState({
        photoSubmitType: type,
        showPhotoVerPopup: !this.state.showPhotoVerPopup
      });
    }
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
    this.setErrorHandler("Upload to S3");
    try {
      //ORIGINAL
      const options = {
        headers: {
          "Content-Type": file.type
        }
      };
      const resp = await axios.put(signedRequest, file, options);
      if (resp.status !== 200) {
        toast.error(this.props.t("uplerr"));
      }
    } catch (e) {
      this.props.ErrorHandler.catchErrors(e);
    }
  };

  toggleDialog = () => {
    const { showModal } = this.state;
    this.setErrorHandler("Dialog Modal Toggled:");
    this.setState({ showModal: !showModal });
  };

  setDialogContent = ({ title, msg, btnText, okAction }) => {
    this.setState({
      title,
      msg,
      btnText,
      okAction,
      showModal: !this.state.showModal
    });
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
      publicPhotos,
      privatePhotos,
      about,
      desires,
      showPhotoVerPopup,
      showDesiresPopup,
      photoSubmitType,
      showImgEditorPopup,
      showImgCropperPopup,
      showCouplePopup,
      showSharePopup,
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
      flashCpl,
      showModal,
      msg,
      btnText,
      title,
      okAction,
      sexuality
    } = this.state;

    const {
      t,
      ErrorHandler,
      currentuser,
      refetchUser,
      dayjs,
      history,
      ReactGA
    } = this.props;

    let aboutErr = "";
    if (about === "") {
      aboutErr = t("fillbio");
    } else if (about.length < 20) {
      aboutErr = t("biolen");
    }

    let profilePicErr = "";
    if (publicPhotos.length === 0) {
      profilePicErr = t("onepho");
    } else if (profilePic === "") {
      profilePicErr = t("selpho");
    }

    const errors = {
      profilePic: profilePicErr !== "" ? profilePicErr : null,
      about: aboutErr !== "" ? aboutErr : null,
      desires: desires.length === 0 ? t("onedes") : null
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
          profilePic,
          sexuality
        }}
      >
        {(updateSettings, { loading }) => {
          this.updateSettings = updateSettings;
          return (
            <section className="settings">
              <div className="container" ref={this.targetElement}>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12 col-lg-3">
                      <div className="sidebar">
                        <ProfilePic
                          profilePic={profilePicUrl}
                          ErrorBoundary={ErrorHandler.ErrorBoundary}
                          history={history}
                          id={currentuser.profileID}
                          removeProfilePic={() =>
                            this.setProfilePic({
                              key: "",
                              url: "",
                              updateSettings
                            })
                          }
                        />
                        <Menu
                          coupleModalToggle={this.toggleCouplesPopup}
                          couplePartner={couplePartner}
                          blackModalToggle={this.toggleBlackPopup}
                          shareModalToggle={this.toggleSharePopup}
                          t={t}
                          flashCpl={flashCpl}
                          currentuser={currentuser}
                          refetchUser={refetchUser}
                          ErrorBoundary={ErrorHandler.ErrorBoundary}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-lg-9">
                      <div className="page mtop">
                        <div className="form">
                          <Preferences
                            distance={distance}
                            distanceMetric={distanceMetric}
                            ageRange={ageRange}
                            interestedIn={interestedIn}
                            city={city}
                            isBlackMember={currentuser.blackMember.active}
                            setValue={({ name, value }) =>
                              this.setValue({
                                name,
                                value,
                                updateSettings
                              })
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
                            ErrorBoundary={ErrorHandler.ErrorBoundary}
                            lang={lang}
                          />
                          <Photos
                            isPrivate={false}
                            showEditor={this.toggleImgEditorPopup}
                            showCropper={this.toggleImgCropperPopup}
                            photos={publicPhotos}
                            setProfilePic={({ key, url }) =>
                              this.setProfilePic({
                                key,
                                url,
                                updateSettings
                              })
                            }
                            isBlackMember={currentuser.blackMember.active}
                            deleteImg={({ file, key }) =>
                              this.setDialogContent({
                                title: t("delpho"),
                                msg: t("remoundone"),
                                btnText: t("common:Delete"),
                                okAction: () =>
                                  this.handlePhotoListChange({
                                    file,
                                    key,
                                    isPrivate: false,
                                    isDeleted: true,
                                    updateSettings
                                  })
                              })
                            }
                            t={t}
                            ErrorBoundary={ErrorHandler.ErrorBoundary}
                            toggleScroll={this.toggleScroll}
                          />
                          {errors.profilePic && (
                            <label className="errorLbl">
                              {errors.profilePic}
                            </label>
                          )}
                          <Photos
                            isPrivate={true}
                            showEditor={this.toggleImgEditorPopup}
                            photos={privatePhotos}
                            isBlackMember={currentuser.blackMember.active}
                            deleteImg={({ file, key }) =>
                              this.setDialogContent({
                                title: t("delpho"),
                                msg: t("remoundone"),
                                btnText: t("common:Delete"),
                                okAction: () =>
                                  this.handlePhotoListChange({
                                    file,
                                    key,
                                    isPrivate: true,
                                    isDeleted: true,
                                    updateSettings
                                  })
                              })
                            }
                            t={t}
                            ErrorBoundary={ErrorHandler.ErrorBoundary}
                          />
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
                            lang={lang}
                            sexuality={sexuality}
                          />
                          <AppSettings
                            setValue={({ name, value }) =>
                              this.setValue({
                                name,
                                value,
                                updateSettings,
                                noSave: true
                              })
                            }
                            visible={visible}
                            lang={lang}
                            emailNotify={emailNotify}
                            showOnline={showOnline}
                            likedOnly={likedOnly}
                            t={t}
                            ErrorBoundary={ErrorHandler.ErrorBoundary}
                            isBlackMember={currentuser.blackMember.active}
                          />
                          <Verifications
                            openPhotoVerPopup={this.openPhotoVerPopup}
                            t={t}
                            ErrorBoundary={ErrorHandler.ErrorBoundary}
                          />
                          {showModal && (
                            <Modal
                              header={title}
                              close={this.toggleDialog}
                              description={msg}
                              okSpan={
                                <span className="color" onClick={okAction}>
                                  {btnText}
                                </span>
                              }
                            />
                          )}
                          {currentuser.blackMember.active && (
                            <ManageBlkMembership
                              ErrorHandler={ErrorHandler}
                              currentuser={currentuser}
                              refetchUser={refetchUser}
                              t={t}
                              dayjs={dayjs}
                              notifyClient={this.notifyClient}
                              setDialogContent={this.setDialogContent}
                              lang={lang}
                              ReactGA={ReactGA}
                            />
                          )}
                          <AcctSettings
                            setValue={({ name, value }) =>
                              this.setValue({
                                name,
                                value,
                                updateSettings
                              })
                            }
                            t={t}
                            ErrorHandler={ErrorHandler}
                            lang={lang}
                            isEmailOK={currentuser.isEmailOK}
                            ReactGA={ReactGA}
                          />
                          <DeactivateAcctBtn
                            t={t}
                            ErrorHandler={ErrorHandler}
                            history={history}
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
                        ErrorHandler={ErrorHandler}
                      />
                    );
                  }}
                </Mutation>
              )}
              {showImgCropperPopup && (
                <Mutation mutation={SIGNS3} variables={{ filename, filetype }}>
                  {signS3 => {
                    return (
                      <ImageCropper
                        imgUrl={fileRecieved}
                        setS3PhotoParams={this.setS3PhotoParams}
                        uploadToS3={this.uploadToS3}
                        signS3={signS3}
                        close={this.toggleImgCropperPopup}
                        ErrorHandler={ErrorHandler}
                        setProfilePic={({ key, url }) =>
                          this.setProfilePic({
                            key,
                            url,
                            updateSettings
                          })
                        }
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
                  ErrorHandler={ErrorHandler}
                  t={t}
                />
              )}
              {showBlackPopup && (
                <BlackModal
                  close={this.toggleBlackPopup}
                  userID={currentuser.userID}
                  ErrorHandler={ErrorHandler}
                  t={t}
                  notifyClient={this.notifyClient}
                  lang={lang}
                />
              )}
              {showSharePopup && (
                <ShareModal
                  userID={currentuser.userID}
                  visible={showSharePopup}
                  close={this.toggleSharePopup}
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

export default withApollo(SettingsPage);
