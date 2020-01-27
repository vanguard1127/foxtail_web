import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import axios from "axios";
import produce from "immer";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from "body-scroll-lock";
import * as yup from "yup";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import ResetPassModal from "../Modals/ResetPassword";
import { UPDATE_SETTINGS, SIGNS3, RESET_PASSWORD } from "../../queries";
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
import KinksModal from "../Modals/Kinks/Modal";
import ShareModal from "../Modals/Share";
import SubmitPhotoModal from "../Modals/SubmitPhoto";
import getCityCountry from "../../utils/getCityCountry";
import DeactivateAcctBtn from "../common/DeactivateAcctBtn";
import Modal from "../common/Modal";
import CoupleProfileModal from "../Modals/CoupleProfile";
import BecomeBlackMemberModal from "../Modals/BecomeBlackMember";
import CreditCardModal from "../Modals/CreditCard";
import Dropdown from "../common/Dropdown";

class SettingsPage extends Component {
  schema;
  constructor(props) {
    super(props);
    this.targetElement = React.createRef();
    this.isPhotoChanged = false;
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
    kinks: [],
    username: undefined,
    email: undefined,
    sexuality: "",
    sex: undefined,
    phone: undefined,
    showKinksPopup: false,
    showPhotoVerPopup: false,
    showBlackPopup: this.props.showBlkModal || false,
    showCCModal: false,
    showImgEditorPopup: false,
    showImgCropperPopup: false,
    showSharePopup: false,
    shareProfile: false,
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
    ccLast4: "",
    verifications: [],
    ...this.props.settings,
    publicPhotoList: undefined,
    privatePhotoList: undefined,
    showModal: false,
    modalDecription: "",
    modalBtnText: "",
    modalTitle: "",
    okAction: null,
    errors: this.props.errors,
    isCouple: this.props.isCouple,
    isInitial: this.props.isInitial,
    modalInputType: "",
    modalValue: "",
    modalPlaceholder: "",
    modalError: undefined,
    modalClassName: "",
    modalInput: undefined,
    schemaType: "",
    resetPassVisible: false,
    clearPassDlg: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.currentuser !== nextProps.currentuser ||
      this.state.about !== nextState.about ||
      this.state.ageRange !== nextState.ageRange ||
      this.state.modalBtnText !== nextState.modalBtnText ||
      this.state.city !== nextState.city ||
      this.state.country !== nextState.country ||
      this.state.couplePartner !== nextState.couplePartner ||
      this.state.kinks !== nextState.kinks ||
      this.state.distance !== nextState.distance ||
      this.state.distanceMetric !== nextState.distanceMetric ||
      this.state.email !== nextState.email ||
      this.state.emailNotify !== nextState.emailNotify ||
      this.state.fileRecieved !== nextState.fileRecieved ||
      this.state.filename !== nextState.filename ||
      this.state.filetype !== nextState.filetype ||
      this.state.flashCpl !== nextState.flashCpl ||
      this.state.sexuality !== nextState.sexuality ||
      this.state.sex !== nextState.sex ||
      this.state.includeMsgs !== nextState.includeMsgs ||
      this.state.interestedIn !== nextState.interestedIn ||
      this.state.isPrivate !== nextState.isPrivate ||
      this.state.lang !== nextState.lang ||
      this.state.lastActive !== nextState.lastActive ||
      this.state.likedOnly !== nextState.likedOnly ||
      this.state.modalDecription !== nextState.modalDecription ||
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
      this.state.showCCModal !== nextState.showCCModal ||
      this.state.showBlackPopup !== nextState.showBlackPopup ||
      this.state.shareProfile !== nextState.shareProfile ||
      this.state.showSharePopup !== nextState.showSharePopup ||
      this.state.showCouplePopup !== nextState.showCouplePopup ||
      this.state.showKinksPopup !== nextState.showKinksPopup ||
      this.state.showImgEditorPopup !== nextState.showImgEditorPopup ||
      this.state.showImgCropperPopup !== nextState.showImgCropperPopup ||
      this.state.showModal !== nextState.showModal ||
      this.state.showOnline !== nextState.showOnline ||
      this.state.showPhotoVerPopup !== nextState.showPhotoVerPopup ||
      this.state.modalTitle !== nextState.modalTitle ||
      this.state.username !== nextState.username ||
      this.state.users !== nextState.users ||
      this.state.vibrateNotify !== nextState.vibrateNotify ||
      this.state.visible !== nextState.visible ||
      this.props.t !== nextProps.t ||
      this.props.errors !== nextProps.errors ||
      this.state.password !== nextState.password ||
      this.state.modalError !== nextState.modalError ||
      this.state.modalClassName !== nextState.modalClassName ||
      this.state.modalInputType !== nextState.modalInputType ||
      this.state.modalValue !== nextState.modalValue ||
      this.state.modalInput !== nextState.modalInput ||
      this.state.schemaType !== nextState.schemaType ||
      this.state.modalPlaceholder !== nextState.modalPlaceholder ||
      this.state.errors !== nextState.errors ||
      this.state.resetPassVisible !== nextState.resetPassVisible ||
      this.state.clearPassDlg !== nextState.clearPassDlg
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    const { history } = this.props;
    history.replace({ state: {} });
    window.addEventListener("beforeunload", () => {
      this.handleSubmit(this.updateSettings);
    });
    this.mounted = true;

    window.scrollTo(0, 1);
  }

  async componentWillUnmount() {
    await this.handleSubmit(this.updateSettings);
    window.removeEventListener("beforeunload", () => {
      this.handleSubmit(this.updateSettings);
    });
    clearAllBodyScrollLocks();
    this.mounted = false;
  }

  handleUpload = async (file, signS3, isPrivate) => {
    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key } = data.signS3;

        this.handlePhotoListChange({
          file,
          key,
          isPrivate,
          isDeleted: false
        });
        this.uploadToS3(file.filebody, signedRequest);

        this.props.toast.dismiss();

        this.toggleImgEditorPopup();
      })
      .catch(res => {
        console.error(res);
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  handlePhotoListChange = ({ file, key, isPrivate, isDeleted }) => {
    const { t, toast } = this.props;
    this.isPhotoChanged = true;
    this.setErrorHandler(
      "Photo list updated isPrivate:" +
        isPrivate +
        "isDeleted:" +
        isDeleted +
        "key:" +
        key
    );
    if (!file) {
      this.setErrorHandler("no file");
      return;
    }
    if (isPrivate) {
      let { privatePhotos } = this.state;

      if (this.mounted) {
        if (isDeleted) {
          if (!privatePhotos || privatePhotos.length === 0) {
            this.setErrorHandler("no private photos available for delete");
            return;
          }

          privatePhotos = privatePhotos.filter(
            x => x.id.toString() !== file.id.toString()
          );

          toast.success(t("photodel"));
        } else {
          privatePhotos = [
            ...privatePhotos,
            {
              uid: Date.now(),
              key,
              url: file.dataURL,
              id: Date.now()
            }
          ];
        }

        this.setState(
          {
            privatePhotos,
            showModal: false,
            publicPhotoList: undefined,
            privatePhotoList: privatePhotos.map(file => {
              file.url = undefined;
              return JSON.stringify(file);
            })
          },
          () => {
            this.handleSubmit(this.updateSettings);
          }
        );
      }
    } else {
      let { publicPhotos } = this.state;

      if (this.mounted) {
        if (isDeleted) {
          if (!publicPhotos || publicPhotos.length === 0) {
            this.setErrorHandler("no public photos available for delete");
            return;
          }
          publicPhotos = publicPhotos.filter(
            x => x.id.toString() !== file.id.toString()
          );
          toast.success(t("photodel"));
        } else {
          publicPhotos = [
            ...publicPhotos,
            {
              uid: Date.now(),
              key,
              url: file.dataURL,
              id: Date.now()
            }
          ];
        }

        const publicPhotoList = produce(publicPhotos, draftState => {
          draftState = draftState.map(file => {
            delete file.url;
            console.log(file);
            return file;
          });
        });
        console.log(publicPhotoList);
        console.log(publicPhotos);
        this.setState(
          {
            publicPhotos,
            showModal: false,
            privatePhotoList: undefined,
            publicPhotoList: publicPhotos.map(file => {
              file.url = undefined;
              return JSON.stringify(file);
            })
          },
          () => {
            this.handleSubmit(this.updateSettings);
            this.fillInErrors(true);
          }
        );
      }
    }
  };

  //Must reset these to prevent override on save
  resetAcctSettingState = () => {
    if (this.mounted) {
      this.setState({
        username: undefined,
        email: undefined,
        sex: undefined,
        phone: undefined
      });
    }
  };

  handleSubmit = (updateSettings, doRefetch) => {
    const { ErrorHandler, t, ReactGA, toast } = this.props;
    const { isCouple, isInitial } = this.state;
    this.setErrorHandler("Settings updated...");

    if (!this.isPhotoChanged) {
      if (this.mounted) {
        this.setState({
          privatePhotoList: undefined,
          publicPhotoList: undefined
        });
        updateSettings()
          .then(({ data }) => {
            if (data.updateSettings) {
              if (isCouple && isInitial && !this.state.flashCpl) {
                if (!toast.isActive("clickcpl")) {
                  toast(t("clickcpl"), {
                    toastId: "clickcpl",
                    autoClose: false
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
            if (doRefetch) {
              this.props.refetchUser();
            }
          })
          .catch(res => {
            this.resetAcctSettingState();
            if (doRefetch) {
              this.props.refetchUser();
            }
            ErrorHandler.catchErrors(res);
          });
      }
    } else {
      this.isPhotoChanged = false;
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
          if (doRefetch) {
            this.props.refetchUser();
          }
        })
        .catch(res => {
          this.resetAcctSettingState();
          ErrorHandler.catchErrors(res);
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
          () => {
            this.handleSubmit(updateSettings, true);
          }
        );
      }
    } else {
      if (this.mounted) this.setState({ city });
    }
  };

  toggleKinks = ({ checked, value }) => {
    const { kinks } = this.state;
    if (this.mounted) {
      if (checked) {
        this.setState({ kinks: [...kinks, value] }, () => this.fillInErrors());
      } else {
        this.setState({ kinks: kinks.filter(kink => kink !== value) }, () =>
          this.fillInErrors()
        );
      }
    }
  };

  setValue = ({ name, value, updateSettings, noSave, doRefetch }) => {
    if (this.mounted) {
      this.setState({ [name]: value }, () => {
        if (noSave === true) {
          if (
            name === "about" ||
            name === "publicPhotos" ||
            name === "profilePic" ||
            name === "kinks"
          ) {
            this.fillInErrors();
          }
          return;
        }

        this.handleSubmit(updateSettings, doRefetch);
      });
    }
  };

  setErrorHandler = message => {
    const { ErrorHandler } = this.props;
    ErrorHandler.setBreadcrumb(message);
  };

  setProfilePic = ({ key, url, updateSettings }) => {
    if (this.mounted) {
      this.setState({ profilePic: key, profilePicUrl: url }, () => {
        this.fillInErrors(true);
        this.handleSubmit(updateSettings, true);
      });
    }
  };

  toggleScroll(enabled) {
    var iOS =
      !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    if (!iOS && this.targetElement) {
      enabled
        ? disableBodyScroll(this.targetElement.current)
        : enableBodyScroll(this.targetElement.current);
    }
  }

  toggleKinksPopup = () => {
    this.setErrorHandler("Kinks popup toggled");
    const { showKinksPopup } = this.state;
    if (this.mounted) {
      this.setState({
        showKinksPopup: !showKinksPopup
      });
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

  toggleCCModal = () => {
    this.setErrorHandler("Toggle Blk popup");
    if (this.mounted) {
      this.setState(
        {
          showCCModal: !this.state.showCCModal
        },
        this.toggleScroll(!this.state.showCCModal)
      );
    }
  };

  toggleSharePopup = shareProfile => {
    this.setErrorHandler("Toggle Share popup");
    if (this.mounted) {
      this.setState(
        {
          showSharePopup: !this.state.showSharePopup,
          shareProfile
        },
        this.toggleScroll(!this.state.showSharePopup)
      );
    }
  };

  notifyClient = text => {
    this.props.toast.success(text);
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
        this.props.toast.error(this.props.t("uplerr"));
      }
    } catch (e) {
      this.props.ErrorHandler.catchErrors(e);
    }
  };

  toggleDialog = () => {
    this.setErrorHandler("Dialog Modal Toggled:");
    this.setState({
      showModal: false,
      modalInputType: "",
      modalValue: "",
      modalPlaceholder: "",
      modalError: undefined,
      modalClassName: "",
      modalInput: undefined,
      schemaType: ""
    });
  };

  fillInErrors = async skipSave => {
    const { about, publicPhotos, profilePic, kinks } = this.state;

    const { t } = this.props;

    let aboutErr = null;
    if (about === "") {
      aboutErr = t("fillbio");
    } else if (about.length <= 20) {
      aboutErr = t("biolen");
    }

    let profilePicErr = null;
    if (publicPhotos.length === 0) {
      profilePicErr = t("onepho");
    } else if (profilePic === "") {
      profilePicErr = t("selpho");
    }

    let kinksErr = kinks.length === 0 ? t("onedes") : null;

    if (
      this.isNull(this.state.errors.profilePic) !==
        this.isNull(profilePicErr) ||
      this.isNull(this.state.errors.about) !== this.isNull(aboutErr) ||
      this.isNull(this.state.errors.kinks) !== this.isNull(kinksErr)
    ) {
      if (!skipSave) {
        await this.handleSubmit(this.updateSettings, true);
      }
    }

    this.setState({
      errors: {
        profilePic: profilePicErr,
        about: aboutErr,
        kinks: kinksErr
      }
    });
  };

  isNull = word => {
    return word === null;
  };

  InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: "red" }}>
        {error}
      </div>
    ) : null;

  handleModalTextChange = event => {
    if (this.mounted) {
      this.setState({ modalValue: event.target.value }, () =>
        this.handleModalInput()
      );
    }
  };

  handleModalValueChange = event => {
    if (this.mounted) {
      this.setState({ modalValue: event.value }, () => this.handleModalInput());
    }
  };

  handleModalError = error => {
    if (this.mounted) {
      this.setState({ modalError: error.text }, () => this.handleModalInput());
    }
  };

  validateForm = async () => {
    const { modalValue, schemaType } = this.state;
    if (this.mounted) {
      try {
        await this.schema.validate({ text: modalValue }, { abortEarly: false });
        this.handleModalError({});
        this.setState({ [schemaType]: modalValue }, () => {
          this.handleSubmit(this.updateSettings, true);
          this.toggleDialog();
        });

        return true;
      } catch (e) {
        let errors = {};
        e.inner.forEach(err => (errors[err.path] = err.message));
        this.handleModalError(errors);
        return false;
      }
    }
  };

  handleModalInput = () => {
    const {
      lang,
      modalInputType,
      modalValue,
      modalPlaceholder,
      modalError
    } = this.state;

    const { ErrorHandler } = this.props;
    if (modalInputType === "sex") {
      this.setState({
        modalInput: (
          <ErrorHandler.ErrorBoundary>
            <Dropdown
              value={modalValue}
              type={modalInputType}
              onChange={this.handleModalValueChange}
              placeholder={modalPlaceholder}
              lang={lang}
              className="dropdown wide"
            />
            {this.InputFeedback(modalError)}
          </ErrorHandler.ErrorBoundary>
        )
      });
    } else if (
      modalInputType === "text" ||
      modalInputType === "password" ||
      modalInputType === "email"
    ) {
      this.setState({
        modalInput: (
          <ErrorHandler.ErrorBoundary>
            <div className="input">
              <input
                placeholder={modalPlaceholder}
                value={modalValue}
                onChange={this.handleModalTextChange}
                autoFocus
                type={modalInputType}
              />
            </div>
            {this.InputFeedback(modalError)}
          </ErrorHandler.ErrorBoundary>
        )
      });
    }
  };

  initializeModal = ({
    modalTitle,
    modalDecription,
    modalClassName,
    okAction,
    modalBtnText,
    modalPlaceholder,
    modalInputType,
    schemaType
  }) => {
    this.setState(
      {
        modalTitle,
        modalDecription,
        modalBtnText,
        okAction,
        modalClassName,
        modalPlaceholder,
        modalInputType,
        schemaType,
        showModal: !this.state.showModal
      },
      () => this.handleModalInput()
    );
  };

  toggleClearPassDlg = () => {
    this.setState({ clearPassDlg: !this.state.clearPassDlg });
  };

  toggleResetPassDlg = () => {
    this.setState({ resetPassVisible: !this.state.resetPassVisible });
  };

  handleDlgBtnClick = resetPassword => {
    resetPassword()
      .then(({ data }) => {
        this.setState({ clearPassDlg: false, password: null });

        this.props.refetchUser();
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res);
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
      sex,
      users,
      publicPhotoList,
      privatePhotoList,
      publicPhotos,
      privatePhotos,
      about,
      kinks,
      showPhotoVerPopup,
      showKinksPopup,
      photoSubmitType,
      showImgEditorPopup,
      showImgCropperPopup,
      showCouplePopup,
      showSharePopup,
      shareProfile,
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
      modalDecription,
      modalBtnText,
      modalTitle,
      okAction,
      sexuality,
      errors,
      password,
      ccLast4,
      showCCModal,
      modalClassName,
      modalInput,
      schemaType,
      resetPassVisible,
      clearPassDlg,
      verifications
    } = this.state;

    const {
      t,
      ErrorHandler,
      currentuser,
      refetchUser,
      dayjs,
      history,
      ReactGA,
      toast
    } = this.props;

    if (schemaType) {
      switch (schemaType) {
        case "email":
          this.schema = yup.object().shape({
            text: yup
              .string()
              .email(t("invemail"))
              .required(t("emailreq"))
          });
          break;
        case "username":
          this.schema = yup.object().shape({
            text: yup.string().required(t("unreq"))
          });
          break;
        case "sex":
          this.schema = yup.object().shape({
            text: yup.string().required(t("genreq"))
          });
          break;
        default:
          this.schema = yup.object().shape({
            text: yup.string()
          });
      }
    }
    console.log("publicPhotos", publicPhotos);
    console.log("publicPhotoList", publicPhotoList);
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
          kinks,
          couplePartner,
          includeMsgs,
          email,
          username,
          sex,
          phone,
          profilePic,
          sexuality,
          profileID: currentuser.profileID
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
                          t={t}
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
                        {(errors.about !== null ||
                          errors.kinks !== null ||
                          errors.profilePic !== null) && (
                          <span className="message">
                            {t("common:plscomplete")}
                          </span>
                        )}
                        <div className="settings-content">
                          <div className="page-section mtop">
                            <MyProfile
                              kinks={kinks}
                              about={about}
                              togglePopup={this.toggleKinksPopup}
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
                          </div>

                          <div className="page-section mtop">
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
                                this.initializeModal({
                                  modalTitle: t("delpho"),
                                  modalDecription: t("remoundone"),
                                  modalBtnText: t("common:Delete"),
                                  okAction: () =>
                                    this.handlePhotoListChange({
                                      file,
                                      key,
                                      isPrivate: false,
                                      isDeleted: true
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
                          </div>
                          <div className="page-section mtop">
                            <Photos
                              isPrivate={true}
                              showEditor={file =>
                                this.toggleImgEditorPopup(file, true)
                              }
                              photos={privatePhotos}
                              isBlackMember={currentuser.blackMember.active}
                              deleteImg={({ file, key }) =>
                                this.initializeModal({
                                  modalTitle: t("delpho"),
                                  modalDecription: t("remoundone"),
                                  modalBtnText: t("common:Delete"),
                                  okAction: () =>
                                    this.handlePhotoListChange({
                                      file,
                                      key,
                                      isPrivate: true,
                                      isDeleted: true
                                    })
                                })
                              }
                              t={t}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                              toggleScroll={this.toggleScroll}
                            />
                          </div>
                          <div className="page-section mtop">
                            <Preferences
                              distance={distance}
                              distanceMetric={distanceMetric}
                              ageRange={ageRange}
                              interestedIn={interestedIn}
                              city={city}
                              isBlackMember={currentuser.blackMember.active}
                              setValue={({ name, value, doRefetch }) =>
                                this.setValue({
                                  name,
                                  value,
                                  updateSettings,
                                  doRefetch
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
                          </div>

                          <div className="page-section mtop">
                            <AppSettings
                              setValue={({ name, value }) =>
                                this.setValue({
                                  name,
                                  value,
                                  updateSettings,
                                  noSave: true
                                })
                              }
                              toast={toast}
                              visible={visible}
                              lang={lang}
                              emailNotify={emailNotify}
                              showOnline={showOnline}
                              likedOnly={likedOnly}
                              t={t}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                              isBlackMember={currentuser.blackMember.active}
                            />
                          </div>
                          {currentuser.blackMember.active && (
                            <div className="page-section mtop">
                              <ManageBlkMembership
                                ErrorHandler={ErrorHandler}
                                currentuser={currentuser}
                                refetchUser={refetchUser}
                                t={t}
                                dayjs={dayjs}
                                notifyClient={this.notifyClient}
                                initializeModal={this.initializeModal}
                                lang={lang}
                                ReactGA={ReactGA}
                                ccLast4={ccLast4}
                                toggleCCModal={this.toggleCCModal}
                              />
                            </div>
                          )}
                          <div className="page-section mtop">
                            <Verifications
                              openPhotoVerPopup={this.openPhotoVerPopup}
                              t={t}
                              ErrorBoundary={ErrorHandler.ErrorBoundary}
                              verifications={verifications}
                            />
                          </div>

                          <div className="page-section mtop">
                            <>
                              <AcctSettings
                                setValue={({ name, value }) =>
                                  this.setValue({
                                    name,
                                    value,
                                    updateSettings,
                                    doRefetch: true
                                  })
                                }
                                t={t}
                                ErrorHandler={ErrorHandler}
                                lang={lang}
                                isEmailOK={currentuser.isEmailOK}
                                ReactGA={ReactGA}
                                passEnabled={password !== null}
                                refetchUser={refetchUser}
                                initializeModal={this.initializeModal}
                                close={this.toggleDialog}
                                handleModalError={this.handleModalError}
                                okAction={this.validateForm}
                                toggleResetPassDlg={this.toggleResetPassDlg}
                                toggleClearPassDlg={this.toggleClearPassDlg}
                              />
                              <DeactivateAcctBtn
                                t={t}
                                ErrorHandler={ErrorHandler}
                                history={history}
                              />
                            </>
                          </div>
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
                        handleUpload={file =>
                          this.handleUpload(file, signS3, isPrivate)
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

              {showKinksPopup && (
                <KinksModal
                  close={this.toggleKinksPopup}
                  onChange={e => this.toggleKinks(e, updateSettings)}
                  kinks={kinks}
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
                <CoupleProfileModal
                  close={this.toggleCouplesPopup}
                  setValue={({ name, value }) =>
                    this.setValue({ name, value, updateSettings })
                  }
                  username={couplePartner}
                  includeMsgs={includeMsgs}
                  ErrorHandler={ErrorHandler}
                />
              )}
              {showBlackPopup && (
                <BecomeBlackMemberModal
                  close={this.toggleBlackPopup}
                  userID={currentuser.userID}
                  ErrorHandler={ErrorHandler}
                  notifyClient={this.notifyClient}
                  lang={lang}
                  t={t}
                  ccLast4={ccLast4}
                  toggleCCModal={this.toggleCCModal}
                />
              )}
              {showCCModal && (
                <CreditCardModal
                  close={this.toggleCCModal}
                  ErrorHandler={ErrorHandler}
                  notifyClient={this.notifyClient}
                  lang={lang}
                  t={t}
                  ccLast4={ccLast4}
                  toggleSharePopup={this.toggleSharePopup}
                />
              )}
              {showSharePopup && (
                <ShareModal
                  userID={currentuser.userID}
                  profileID={shareProfile ? currentuser.profileID : null}
                  visible={showSharePopup}
                  close={this.toggleSharePopup}
                  ErrorBoundary={ErrorHandler.ErrorBoundary}
                  t={t}
                />
              )}
              {showModal && (
                <Modal
                  header={modalTitle}
                  close={this.toggleDialog}
                  description={modalDecription}
                  className={modalClassName}
                  okSpan={
                    <span className="color" onClick={okAction}>
                      {modalBtnText}
                    </span>
                  }
                >
                  {modalInput}
                </Modal>
              )}
              <Dialog onClose={this.toggleClearPassDlg} open={clearPassDlg}>
                <DialogTitle id="alert-dialog-title">
                  {t("removepass")}
                </DialogTitle>

                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {t("removepassdes")}
                  </DialogContentText>
                </DialogContent>

                <DialogActions>
                  <Mutation
                    mutation={RESET_PASSWORD}
                    variables={{
                      password: ""
                    }}
                  >
                    {resetPassword => (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            this.handleDlgBtnClick(resetPassword);
                          }}
                        >
                          {"Remove Password"}
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            this.setState({ clearPassDlg: false });
                          }}
                        >
                          {t("common:Cancel")}
                        </Button>
                      </>
                    )}
                  </Mutation>
                </DialogActions>
              </Dialog>
              {resetPassVisible && (
                <ResetPassModal
                  t={t}
                  close={() => this.setState({ resetPassVisible: false })}
                  ErrorHandler={ErrorHandler}
                  isLoggedIn={true}
                  ReactGA={ReactGA}
                  callback={() => {
                    this.setState({ password: "" });
                    refetchUser();
                  }}
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
