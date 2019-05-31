import React, { Component } from "react";
import { Mutation } from "react-apollo";
import axios from "axios";
import { UPDATE_SETTINGS, SIGNS3 } from "../../queries";
import ImageEditor from "../Modals/ImageEditor";
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
import SubmitPhotoModal from "../Modals/SubmitPhoto";
import CoupleModal from "../Modals/Couples";
import BlackModal from "../Modals/Black";
import getCityCountry from "../../utils/getCityCountry";
import Modal from "../common/Modal";
import { toast } from "react-toastify";

class SettingsPage extends Component {
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
    publicPics: this.props.settings.photos.filter(
      x => !x.private && x.url !== ""
    ),
    privatePics: this.props.settings.photos.filter(
      x => x.private && x.url !== ""
    ),
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
      this.state.photos !== nextState.photos ||
      this.state.privatePhotoList !== nextState.privatePhotoList ||
      this.state.privatePics !== nextState.privatePics ||
      this.state.profilePic !== nextState.profilePic ||
      this.state.profilePicUrl !== nextState.profilePicUrl ||
      this.state.publicPhotoList !== nextState.publicPhotoList ||
      this.state.publicPics !== nextState.publicPics ||
      this.state.showBlackPopup !== nextState.showBlackPopup ||
      this.state.showCouplePopup !== nextState.showCouplePopup ||
      this.state.showDesiresPopup !== nextState.showDesiresPopup ||
      this.state.showImgEditorPopup !== nextState.showImgEditorPopup ||
      this.state.showModal !== nextState.showModal ||
      this.state.showOnline !== nextState.showOnline ||
      this.state.showPhotoVerPopup !== nextState.showPhotoVerPopup ||
      this.state.title !== nextState.title ||
      this.state.username !== nextState.username ||
      this.state.users !== nextState.users ||
      this.state.vibrateNotify !== nextState.vibrateNotify ||
      this.state.visible !== nextState.visible
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    const { history } = this.props;
    history.replace({ state: {} });
    this.mounted = true;
  }

  async componentWillUnmount() {
    const { ErrorHandler, isCouple, isInitial, refetchUser, t } = this.props;
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
        refetchUser();
        console.log("updateSettings saved.");
      })
      .catch(res => {
        ErrorHandler.catchErrors(res.graphQLErrors);
      });

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
    const { t } = this.props;
    this.setErrorHandler("Photo list updated");
    if (isPrivate) {
      let { privatePics } = this.state;

      if (isDeleted) {
        privatePics = privatePics.filter(x => x.id !== file.id);

        this.setState({ showModal: false });
        toast.success(t("photodel"));
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
        this.setState({
          privatePics,
          publicPhotoList: undefined,
          privatePhotoList: privatePics.map(file => JSON.stringify(file))
        });
      }
    } else {
      let { publicPics, profilePic } = this.state;

      if (isDeleted) {
        if (profilePic === file.key) {
          if (this.mounted) {
            this.setState({ profilePic: "", profilePicUrl: "" });
          }
        }
        publicPics = publicPics.filter(x => x.id !== file.id);
        this.setState({ showModal: false });
        toast.success(t("photodel"));
      } else {
        publicPics = [
          ...publicPics,
          {
            uid: Date.now(),
            key,
            url
          }
        ];
        if (profilePic === "") {
          if (this.mounted) {
            this.setState({ profilePic: key, profilePicUrl: url });
          }
        }
      }
      if (this.mounted) {
        this.setState({
          publicPics,
          privatePhotoList: undefined,
          publicPhotoList: publicPics.map(file => JSON.stringify(file))
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
    console.log("handleSubmit");
    const { ErrorHandler, isCouple, isInitial, refetchUser, t } = this.props;

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

  toggleDesiresPopup = () => {
    this.setErrorHandler("Desires popup toggled");
    if (this.mounted) {
      this.setState({
        showDesiresPopup: !this.state.showDesiresPopup
      });
    }
  };

  toggleImgEditorPopup = (file, isPrivate) => {
    this.setErrorHandler("Toggle image editor");
    if (this.mounted) {
      this.setState({
        fileRecieved: file,
        isPrivate,
        showImgEditorPopup: !this.state.showImgEditorPopup
      });
    }
  };

  togglePhotoVerPopup = () => {
    this.setErrorHandler("Toggle Photo Ver Popup");
    if (this.mounted) {
      this.setState({
        showPhotoVerPopup: !this.state.showPhotoVerPopup
      });
    }
  };

  toggleCouplesPopup = () => {
    this.setErrorHandler("Toggle Couple popup");
    if (this.mounted) {
      this.setState({
        showCouplePopup: !this.state.showCouplePopup,
        flashCpl: false
      });
    }
  };

  toggleBlackPopup = () => {
    this.setErrorHandler("Toggle Blk popup");
    if (this.mounted) {
      this.setState({
        showBlackPopup: !this.state.showBlackPopup
      });
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
      flashCpl,
      showModal,
      msg,
      btnText,
      title,
      okAction,
      sexuality
    } = this.state;

    const {
      userID,
      t,
      ErrorHandler,
      currentuser,
      refetchUser,
      dayjs,
      history
    } = this.props;

    let aboutErr = "";
    if (about === "") {
      aboutErr = t("fillbio");
    } else if (about.length < 20) {
      aboutErr = t("biolen");
    }

    let profilePicErr = "";
    if (publicPics.length === 0) {
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
              <div className="container">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12 col-lg-3">
                      <div className="sidebar">
                        <ProfilePic
                          profilePic={profilePicUrl}
                          ErrorBoundary={ErrorHandler.ErrorBoundary}
                          history={history}
                          id={currentuser.profileID}
                        />
                        <Menu
                          coupleModalToggle={this.toggleCouplesPopup}
                          couplePartner={couplePartner}
                          blackModalToggle={this.toggleBlackPopup}
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
                                updateSettings,
                                noSave: false
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
                            photos={publicPics}
                            setProfilePic={({ key, url }) =>
                              this.setProfilePic({
                                key,
                                url,
                                updateSettings
                              })
                            }
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
                                noSave: true
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
                    this.setValue({ name, value, updateSettings, noSave: true })
                  }
                  username={couplePartner}
                  includeMsgs={includeMsgs}
                  ErrorHandler={ErrorHandler}
                />
              )}
              {showBlackPopup && (
                <BlackModal
                  close={this.toggleBlackPopup}
                  userID={userID}
                  ErrorHandler={ErrorHandler}
                  t={t}
                  notifyClient={this.notifyClient}
                  lang={lang}
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
