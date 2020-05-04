import React, { useState, useEffect } from "react";
import { Mutation, withApollo } from "react-apollo";
import { useMutation } from "@apollo/react-hooks";
import axios from "axios";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from "body-scroll-lock";
import { WithTranslation } from "react-i18next";
import { RouteChildrenProps } from "react-router-dom";
import * as yup from "yup";
import produce from "immer";

import { UPDATE_SETTINGS, SIGNS3, RESET_PASSWORD } from "queries";
import getCityCountry from "utils/getCityCountry";
import ResetPassModal from "components/Modals/ResetPassword";
import ImageEditor from "components/Modals/ImageEditor";
import ImageCropper from "components/Modals/ImageCropper";
import KinksModal from "components/Modals/Kinks/Modal";
import ShareModal from "components/Modals/Share";
import SubmitPhotoModal from "components/Modals/SubmitPhoto";
import DeactivateAcctBtn from "components/common/DeactivateAcctBtn";
import Modal from "components/common/Modal";
import CoupleProfileModal from "components/Modals/CoupleProfile";
import BecomeBlackMemberModal from "components/Modals/BecomeBlackMember";
import CreditCardModal from "components/Modals/CreditCard";
import Dropdown from "components/common/Dropdown";
import { IUser } from "types/user";

import ProfilePic from "./ProfilePic";
import Photos from "./Photos/";
import Menu from "./Menu/";
import Preferences from "./Preferences/";
import AppSettings from "./AppSettings";
import AcctSettings from "./AcctSettings/";
import Verifications from "./Verifications";
import ManageBlkMembership from "./ManageBlkMembership/";
import MyProfile from "./MyProfile/";

interface ISettingsPageProps extends WithTranslation, RouteChildrenProps {
  ErrorHandler: any,
  currentuser: IUser,
  refetchUser: any,
  dayjs: any,
  ReactGA: any,
  toast: any,
  settings: any,
  isCouple: boolean,
  isInitial: boolean,
  showBlkModal: boolean,
  showCplModal: boolean,
  errors: any
}

const SettingsPage: React.FC<ISettingsPageProps> = ({
  t,
  ErrorHandler,
  currentuser,
  refetchUser,
  dayjs,
  history,
  ReactGA,
  toast,
  showCplModal,
  showBlkModal,
  isCouple,
  isInitial,
  settings,
  errors
}) => {
  const [schema, setschema] = useState<any>();
  const [targetElement, settargetElement] = useState<any>(React.createRef());
  const [isPhotoChanged, setIsPhotoChanged] = useState<boolean>(false);

  //Added Setting to pre pop current settings if theres a better way Im open...
  const [state, setState] = useState<any>({
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
    publicPhotos: settings.publicPhotos,
    privatePhotos: settings.privatePhotos,
    about: undefined,
    kinks: [],
    username: undefined,
    email: undefined,
    sexuality: "",
    sex: undefined,
    showKinksPopup: false,
    showPhotoVerPopup: false,
    showBlackPopup: showBlkModal || false,
    showCCModal: false,
    showImgEditorPopup: false,
    showImgCropperPopup: false,
    showSharePopup: false,
    shareProfile: false,
    showCouplePopup: showCplModal || false,
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
    ...settings,
    publicPhotoList: undefined,
    privatePhotoList: undefined,
    showModal: false,
    modalDecription: "",
    modalBtnText: "",
    modalTitle: "",
    okAction: null,
    errors: errors,
    isCouple: isCouple,
    isInitial: isInitial,
    modalInputType: "",
    modalValue: "",
    modalPlaceholder: "",
    modalError: undefined,
    modalClassName: "",
    modalInput: undefined,
    schemaType: "",
    resetPassVisible: false,
    clearPassDlg: false,
    currPassword: ""
  })

  const [updateSettings] = useMutation(UPDATE_SETTINGS);

  useEffect(() => {
    history.replace({ state: {} });
    window.addEventListener("beforeunload", () => {
      handleSubmit();
    });
    window.scrollTo(0, 1);
    return () => {
      handleSubmit();
      window.removeEventListener("beforeunload", () => {
        handleSubmit();
      });
      clearAllBodyScrollLocks();
    }
  }, [location])

  const handleUpload = async (file, signS3, isPrivate) => {

    const signS3res = await signS3({ variables: { filetype: file.filetype } });
    const { signedRequest, key } = signS3res.signS3;

    try {
      handlePhotoListChange({
        file,
        key,
        isPrivate,
        isDeleted: false
      });

      await uploadToS3(file.filebody, signedRequest);

      toast.dismiss();

      toggleImgEditorPopup();
    } catch (err) {
      ErrorHandler.catchErrors(err.graphQLErrors);
    }
  };

  const handlePhotoListChange = ({ file, key, isPrivate, isDeleted }) => {
    setIsPhotoChanged(true)
    setErrorHandler(
      "Photo list updated isPrivate:" +
      isPrivate +
      "isDeleted:" +
      isDeleted +
      "key:" +
      key
    );
    if (!file) {
      setErrorHandler("no file");
      return;
    }
    if (isPrivate) {
      let { privatePhotos } = state;


      if (isDeleted) {
        if (!privatePhotos || privatePhotos.length === 0) {
          setErrorHandler("no private photos available for delete");
          return;
        }

        privatePhotos = privatePhotos.filter(
          x => x.id.toString() !== file.id.toString()
        );
        setErrorHandler({
          message: "private photo delete",
          privatePhotos
        });
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
      const privatePhotoList = produce(privatePhotos, draftState => {
        draftState = draftState.map(file => {
          delete file.url;
          return file;
        });
      });

      setState(
        {
          ...state,
          privatePhotos,
          showModal: false,
          publicPhotoList: undefined,
          privatePhotoList: privatePhotoList.map(file => JSON.stringify(file))
        })

      handleSubmit();
    } else {
      let { publicPhotos } = state;


      if (isDeleted) {
        if (!publicPhotos || publicPhotos.length === 0) {
          setErrorHandler("no public photos available for delete");
          return;
        }
        publicPhotos = publicPhotos.filter(
          x => x.id.toString() !== file.id.toString()
        );
        setErrorHandler({
          message: "public photo delete",
          publicPhotos
        });
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
          return file;
        });
      });

      setState(
        {
          ...state,
          publicPhotos,
          showModal: false,
          privatePhotoList: undefined,
          publicPhotoList: publicPhotoList.map(file => JSON.stringify(file))
        }
      );
      handleSubmit();
      fillInErrors(true);

    }
  };

  //Must reset these to prevent override on save
  const resetAcctSettingState = () => {

    setState({
      username: undefined,
      email: undefined,
      sex: undefined
    });

  };

  const handleSubmit = async (doRefetch?: boolean) => {
    const { isCouple, isInitial } = state;
    setErrorHandler("Settings updated...");

    const { lat,
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
      profilePic,
      sexuality } = state;

    await updateSettings({
      variables: {
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
        profilePic,
        sexuality,
        profileID: currentuser.profileID
      }
    })

    if (!isPhotoChanged) {
      setState({
        privatePhotoList: undefined,
        publicPhotoList: undefined
      });
      updateSettings()
        .then(({ data }) => {
          if (data.updateSettings) {
            if (isCouple && isInitial && !state.flashCpl) {
              if (!toast.isActive("clickcpl")) {
                toast(t("clickcpl"), {
                  toastId: "clickcpl",
                  autoClose: false
                });
              }
              setState({ flashCpl: true });
              ReactGA.event({
                category: "Settings",
                action: "Updated"
              });
            }
          }
        })
        .then(() => {
          resetAcctSettingState();
          if (doRefetch) {
            refetchUser();
          }
        })
        .catch(res => {
          resetAcctSettingState();
          if (doRefetch) {
            refetchUser();
          }
          ErrorHandler.catchErrors(res);
        });

    } else {
      setIsPhotoChanged(false);
      updateSettings()
        .then(({ data }) => {
          if (data.updateSettings) {
            ReactGA.event({
              category: "Settings",
              action: "Updated"
            });
            if (isCouple && isInitial) {
              setState({ flashCpl: true });
            }
          }
        })
        .then(() => {
          resetAcctSettingState();
          if (doRefetch) {
            refetchUser();
          }
        })
        .catch(res => {
          resetAcctSettingState();
          ErrorHandler.catchErrors(res);
        });
    }
  };

  const setLocationValues = async ({ lat, long, city }) => {
    if (lat && long) {
      const citycntry = await getCityCountry({
        long,
        lat
      });

      setState(
        {
          ...state,
          long,
          lat,
          city: citycntry.city,
          country: citycntry.country
        })
      handleSubmit(true);

    } else {
      setState({ city });
    }
  };

  const toggleKinks = ({ checked, value }) => {
    const { kinks } = state;

    if (checked) {
      setState({ ...state, kinks: [...kinks, value] });
      fillInErrors()
    } else {
      setState({ ...state, kinks: kinks.filter(kink => kink !== value) });
      fillInErrors();
    }

  };

  const setValue = ({ name, value, noSave, doRefetch }) => {
    setState({ ...state, [name]: value })

    if (noSave === true) {
      if (
        name === "about" ||
        name === "publicPhotos" ||
        name === "profilePic" ||
        name === "kinks"
      ) {
        fillInErrors();
      }
      return;
    }

    handleSubmit(doRefetch);
  };

  const setErrorHandler = message => {
    ErrorHandler.setBreadcrumb(message);
  };

  const setProfilePic = ({ key, url }) => {
    setState({ ...state, profilePic: key, profilePicUrl: url });
    fillInErrors(true);
    handleSubmit(true);
  };

  const toggleScroll = (enabled: boolean) => {
    var iOS =
      !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    if (!iOS && targetElement) {
      enabled
        ? disableBodyScroll(targetElement.current)
        : enableBodyScroll(targetElement.current);
    }
  }

  const toggleKinksPopup = () => {
    setErrorHandler("Kinks popup toggled");
    const { showKinksPopup } = state;

    setState({
      showKinksPopup: !showKinksPopup
    });

  };

  const toggleImgEditorPopup = (file = null, isPrivate = null) => {
    setErrorHandler("Toggle image editor");

    setState(
      {
        ...state,
        fileRecieved: file,
        isPrivate,
        showImgEditorPopup: !state.showImgEditorPopup
      })

    toggleScroll(!state.showImgEditorPopup);


  };

  const toggleImgCropperPopup = url => {
    setErrorHandler("Toggle image cropper");

    setState(
      {
        ...state,
        fileRecieved: url,
        showImgCropperPopup: !state.showImgCropperPopup
      });

    toggleScroll(!state.showImgCropperPopup)
  };

  const togglePhotoVerPopup = () => {
    setErrorHandler("Toggle Photo Ver Popup");

    setState(
      {
        ...state,
        showPhotoVerPopup: !state.showPhotoVerPopup
      });
    toggleScroll(!state.showPhotoVerPopup);


  };

  const toggleCouplesPopup = () => {
    setErrorHandler("Toggle Couple popup");

    setState(
      {
        ...state,
        showCouplePopup: !state.showCouplePopup,
        flashCpl: false
      },

    );
    toggleScroll(!state.showCouplePopup)

  };

  const toggleBlackPopup = () => {
    setErrorHandler("Toggle Blk popup");

    setState(
      {
        ...state,
        showBlackPopup: !state.showBlackPopup
      }
    );
    toggleScroll(!state.showBlackPopup)

  };

  const toggleCCModal = () => {
    setErrorHandler("Toggle Blk popup");

    setState(
      {
        ...state,
        showCCModal: !state.showCCModal
      }
    );

    toggleScroll(!state.showCCModal)
  };

  const toggleSharePopup = shareProfile => {
    setErrorHandler("Toggle Share popup");

    setState(
      {
        ...state,
        showSharePopup: !state.showSharePopup,
        shareProfile
      }

    );
    toggleScroll(!state.showSharePopup)
  };

  const notifyClient = text => {
    toast.success(text);
  };
  const openPhotoVerPopup = type => {

    setState({
      ...state,
      photoSubmitType: type,
      showPhotoVerPopup: !state.showPhotoVerPopup
    });

  };

  const setS3PhotoParams = type => {

    setState({
      ...state,
      filetype: type
    });

  };

  const uploadToS3 = async (file, signedRequest) => {
    setErrorHandler("Upload to S3");
    try {
      //ORIGINAL
      const options = {
        headers: {
          "Content-Type": file.type
        }
      };

      const resp = await axios.put(signedRequest, file, options);
      if (resp.status !== 200) {
        toast.error(t("uplerr"));
      }
    } catch (e) {
      ErrorHandler.catchErrors(e);
    }
  };

  const toggleDialog = () => {
    setErrorHandler("Dialog Modal Toggled:");
    setState({
      ...state,
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

  const fillInErrors = async (skipSave = true) => {
    const { about, publicPhotos, profilePic, kinks } = state;

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
      isNull(state.errors.profilePic) !==
      isNull(profilePicErr) ||
      isNull(state.errors.about) !== isNull(aboutErr) ||
      isNull(state.errors.kinks) !== isNull(kinksErr)
    ) {
      if (!skipSave) {
        await handleSubmit(true);
      }
    }

    setState({
      ...state,
      errors: {
        profilePic: profilePicErr,
        about: aboutErr,
        kinks: kinksErr
      }
    });
  };

  const isNull = word => {
    return word === null;
  };

  const InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: "red" }}>
        {error}
      </div>
    ) : null;

  const handleModalTextChange = event => {

    setState({ ...state, modalValue: event.target.value });
    handleModalInput()

  };

  const handleModalValueChange = event => {

    setState({ ...state, modalValue: event.value });
    handleModalInput()

  };

  const handleModalError = error => {

    setState({ ...state, modalError: error.text });
    handleModalInput()

  };

  const validateForm = async () => {
    const { modalValue, schemaType } = state;

    try {
      await schema.validate({ text: modalValue }, { abortEarly: false });
      handleModalError({});
      setState({ ...state, [schemaType]: modalValue });
      handleSubmit(true);
      toggleDialog();
      return true;
    } catch (e) {
      let errors = {};
      e.inner.forEach(err => (errors[err.path] = err.message));
      handleModalError(errors);
      return false;
    }

  };

  const handleModalInput = () => {
    const {
      lang,
      modalInputType,
      modalValue,
      modalPlaceholder,
      modalError
    } = state;

    if (modalInputType === "sex") {
      setState({
        modalInput: (
          <ErrorHandler.ErrorBoundary>
            <Dropdown
              value={modalValue}
              type={modalInputType}
              onChange={handleModalValueChange}
              placeholder={modalPlaceholder}
              lang={lang}
              className="dropdown wide"
            />
            {InputFeedback(modalError)}
          </ErrorHandler.ErrorBoundary>
        )
      });
    } else if (
      modalInputType === "text" ||
      modalInputType === "password" ||
      modalInputType === "email"
    ) {
      setState({
        modalInput: (
          <ErrorHandler.ErrorBoundary>
            <div className="input">
              <input
                placeholder={modalPlaceholder}
                value={modalValue}
                onChange={handleModalTextChange}
                autoFocus
                type={modalInputType}
              />
            </div>
            {InputFeedback(modalError)}
          </ErrorHandler.ErrorBoundary>
        )
      });
    }
  };

  const initializeModal = ({
    modalTitle,
    modalDecription,
    modalClassName,
    okAction,
    modalBtnText,
    modalPlaceholder,
    modalInputType,
    schemaType
  }) => {
    setState(
      {
        ...state,
        modalTitle,
        modalDecription,
        modalBtnText,
        okAction,
        modalClassName,
        modalPlaceholder,
        modalInputType,
        schemaType,
        showModal: !state.showModal
      }
    );
    handleModalInput()
  };

  //BEst way to set state?
  const toggleClearPassDlg = () => {
    setState({ ...state, clearPassDlg: !state.clearPassDlg });
  };

  const toggleResetPassDlg = () => {
    setState({ resetPassVisible: !state.resetPassVisible });
  };

  const handleDlgBtnClick = resetPassword => {
    resetPassword()
      .then(({ data }) => {
        if (data.resetPassword) {
          setState({
            clearPassDlg: false,
            password: "",
            currPassword: null
          });
          alert(t("common:Password Updated Successfully"));
          refetchUser();
        } else {
          setState({
            clearPassDlg: false,
            password: null,
            currPassword: null
          });
          alert(t("common:Password Removed Successfully"));
          refetchUser();
        }
      })
      .catch(res => {
        ErrorHandler.catchErrors(res);
      });
  };

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
    filetype,
    isPrivate,
    profilePicUrl,
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
    verifications,
    currPassword
  } = state;


  if (schemaType) {
    switch (schemaType) {
      case "email":
        setschema(yup.object().shape({
          text: yup
            .string()
            .email(t("invemail"))
            .required(t("emailreq"))
        }));
        break;
      case "username":
        setschema(yup.object().shape({
          text: yup.string().required(t("unreq"))
        }))
        break;
      case "sex":
        setschema(yup.object().shape({
          text: yup.string().required(t("genreq"))
        }));
        break;
      default:
        setschema(yup.object().shape({
          text: yup.string()
        }));
    }
  }



  return (
    <section className="settings">
      <div className="container" ref={targetElement}>
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
                    setProfilePic({
                      key: "",
                      url: ""
                    })
                  }
                />
                <Menu
                  coupleModalToggle={toggleCouplesPopup}
                  couplePartner={couplePartner}
                  blackModalToggle={toggleBlackPopup}
                  shareModalToggle={toggleSharePopup}
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
                      togglePopup={toggleKinksPopup}
                      setValue={({ name, value, noSave }) =>
                        setValue({
                          name,
                          value,
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
                      showEditor={toggleImgEditorPopup}
                      showCropper={toggleImgCropperPopup}
                      photos={publicPhotos}
                      setProfilePic={({ key, url }) =>
                        setProfilePic({
                          key,
                          url
                        })
                      }
                      isBlackMember={currentuser.blackMember.active}
                      deleteImg={({ file, key }) =>
                        initializeModal({
                          modalTitle: t("delpho"),
                          modalDecription: t("remoundone"),
                          modalBtnText: t("common:Delete"),
                          okAction: () =>
                            handlePhotoListChange({
                              file,
                              key,
                              isPrivate: false,
                              isDeleted: true
                            })
                        })
                      }
                      t={t}
                      ErrorBoundary={ErrorHandler.ErrorBoundary}
                      toggleScroll={toggleScroll}
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
                        toggleImgEditorPopup(file, true)
                      }
                      photos={privatePhotos}
                      isBlackMember={currentuser.blackMember.active}
                      deleteImg={({ file, key }) =>
                        initializeModal({
                          modalTitle: t("delpho"),
                          modalDecription: t("remoundone"),
                          modalBtnText: t("common:Delete"),
                          okAction: () =>
                            handlePhotoListChange({
                              file,
                              key,
                              isPrivate: true,
                              isDeleted: true
                            })
                        })
                      }
                      t={t}
                      ErrorBoundary={ErrorHandler.ErrorBoundary}
                      toggleScroll={toggleScroll}
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
                        setValue({
                          name,
                          value,
                          doRefetch
                        })
                      }
                      setLocationValues={({ lat, long, city }) =>
                        setLocationValues({
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
                        setValue({
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
                        notifyClient={notifyClient}
                        initializeModal={initializeModal}
                        lang={lang}
                        ReactGA={ReactGA}
                        ccLast4={ccLast4}
                        toggleCCModal={toggleCCModal}
                      />
                    </div>
                  )}
                  <div className="page-section mtop">
                    <Verifications
                      openPhotoVerPopup={openPhotoVerPopup}
                      t={t}
                      ErrorBoundary={ErrorHandler.ErrorBoundary}
                      verifications={verifications}
                    />
                  </div>

                  <div className="page-section mtop">
                    <>
                      <AcctSettings
                        setValue={({ name, value }) =>
                          setValue({
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
                        initializeModal={initializeModal}
                        close={toggleDialog}
                        handleModalError={handleModalError}
                        okAction={validateForm}
                        toggleResetPassDlg={toggleResetPassDlg}
                        toggleClearPassDlg={toggleClearPassDlg}
                      />
                      <DeactivateAcctBtn
                        t={t}
                        ErrorHandler={ErrorHandler}
                        history={history}
                        toggleSharePopup={toggleSharePopup}
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
        <Mutation mutation={SIGNS3} variables={{ filetype }}>
          {signS3 => {
            return (
              <ImageEditor
                file={fileRecieved}
                handleUpload={file =>
                  handleUpload(file, signS3, isPrivate)
                }
                setS3PhotoParams={setS3PhotoParams}
                uploadToS3={uploadToS3}
                signS3={signS3}
                close={toggleImgEditorPopup}
                ErrorHandler={ErrorHandler}
              />
            );
          }}
        </Mutation>
      )}
      {showImgCropperPopup && (
        <Mutation mutation={SIGNS3} variables={{ filetype }}>
          {signS3 => {
            return (
              <ImageCropper
                imgUrl={fileRecieved}
                setS3PhotoParams={setS3PhotoParams}
                uploadToS3={uploadToS3}
                signS3={signS3}
                close={toggleImgCropperPopup}
                ErrorHandler={ErrorHandler}
                setProfilePic={({ key, url }) =>
                  setProfilePic({
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
          close={toggleKinksPopup}
          onChange={e => toggleKinks(e, updateSettings)}
          kinks={kinks}
          updateSettings={updateSettings}
          ErrorBoundary={ErrorHandler.ErrorBoundary}
        />
      )}
      {showPhotoVerPopup && (
        <SubmitPhotoModal
          close={togglePhotoVerPopup}
          type={photoSubmitType}
          ErrorHandler={ErrorHandler}
        />
      )}
      {showCouplePopup && (
        <CoupleProfileModal
          close={toggleCouplesPopup}
          setValue={({ name, value }) =>
            setValue({ name, value, updateSettings })
          }
          username={couplePartner}
          includeMsgs={includeMsgs}
          ErrorHandler={ErrorHandler}
        />
      )}
      {showBlackPopup && (
        <BecomeBlackMemberModal
          close={toggleBlackPopup}
          userID={currentuser.userID}
          ErrorHandler={ErrorHandler}
          notifyClient={notifyClient}
          lang={lang}
          t={t}
          ccLast4={ccLast4}
          toggleCCModal={toggleCCModal}
        />
      )}
      {showCCModal && (
        <CreditCardModal
          close={toggleCCModal}
          ErrorHandler={ErrorHandler}
          notifyClient={notifyClient}
          lang={lang}
          t={t}
          ccLast4={ccLast4}
          toggleSharePopup={toggleSharePopup}
        />
      )}
      {showSharePopup && (
        <ShareModal
          userID={currentuser.userID}
          profileID={shareProfile ? currentuser.profileID : null}
          visible={showSharePopup}
          close={toggleSharePopup}
          ErrorBoundary={ErrorHandler.ErrorBoundary}
          t={t}
        />
      )}
      {showModal && (
        <Modal
          header={modalTitle}
          close={toggleDialog}
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
      {clearPassDlg && (
        <Modal
          header={t("removepass")}
          close={toggleClearPassDlg}
          description={t("removepassdes")}
          className={modalClassName}
          okSpan={
            <Mutation
              mutation={RESET_PASSWORD}
              variables={{
                password,
                currPassword
              }}
            >
              {resetPassword => (
                <span
                  className="color"
                  onClick={() => {
                    handleDlgBtnClick(resetPassword);
                  }}
                >
                  {"Remove Password"}
                </span>
              )}
            </Mutation>
          }
        >
          <div className="input">
            <input
              style={{ width: "100%" }}
              type="password"
              placeholder={"Password (if you have one)"}
              onChange={e => {
                setValue({
                  name: "currPassword",
                  value: e.target.value,
                  noSave: true
                });
              }}
              value={currPassword}
            />
          </div>
        </Modal>
      )}
      {resetPassVisible && (
        <ResetPassModal
          t={t}
          close={() => setState({ resetPassVisible: false })}
          ErrorHandler={ErrorHandler}
          isLoggedIn={true}
          ReactGA={ReactGA}
          callback={() => {
            setState({ password: "" });
            refetchUser();
          }}
        />
      )}
    </section>
  );



}

export default withApollo(SettingsPage);
