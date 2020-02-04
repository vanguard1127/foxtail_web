import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { DateTimePicker } from "@material-ui/pickers";
import * as yup from "yup";
import axios from "axios";
import { Mutation } from "react-apollo";
import { SIGNS3, CREATE_EVENT } from "../../../queries";
import PhotoUpload from "../../common/PhotoUpload";
import KinksModal from "../Kinks/Modal";
import KinksSelector from "../../Modals/Kinks/Selector";
import AddressSearch from "../../common/AddressSearch";
import Modal from "../../common/Modal";
import isEmpty from "../../../utils/isEmpty";
import { toast } from "react-toastify";
import Dropdown from "../../common/Dropdown";

class CreateEvent extends Component {
  schema = yup.object().shape({
    eventname: yup
      .string()
      .min(3, "eve3char")
      .max(120, "eve120")
      .required("evereq"),
    description: yup
      .string()
      .min(10, "dec10char")
      .max(2500, "dec2500")
      .required("decreq"),
    type: yup.string().required("evetypereq"),
    address: yup
      .string()
      .max(240, "dec240")
      .required("addreq")
  });
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.eventname !== nextState.eventname ||
      this.state.tagline !== nextState.tagline ||
      this.state.description !== nextState.description ||
      this.state.kinks !== nextState.kinks ||
      this.state.kinks.length !== nextState.kinks.length ||
      this.state.address !== nextState.address ||
      this.state.image.name !== nextState.image.name ||
      this.state.startTime !== nextState.startTime ||
      this.state.endTime !== nextState.endTime ||
      this.state.interestedIn.length !== nextState.interestedIn.length ||
      this.state.showInfo !== nextState.showInfo ||
      this.state.showKinksPopup !== nextState.showKinksPopup ||
      this.state.type !== nextState.type ||
      this.state.errors !== nextState.errors ||
      this.state.removeCurrentImage !== nextState.removeCurrentImage ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }
  state = {
    eventname: "",
    tagline: "",
    description: "",
    filename: "",
    filetype: "",
    kinks: [],
    lat: null,
    long: null,
    address: "",
    image: "",
    type: "",
    startTime: null,
    endTime: null,
    interestedIn: [],
    errors: {},
    showInfo: true,
    showKinksPopup: false,
    isImageAlt: false,
    removeCurrentImage: this.props.updateEventProps
      ? this.props.updateEventProps.image
      : false,
    setOlderImage: false,
    ...this.props.updateEventProps
  };

  componentDidMount() {
    this.mounted = true;
    this.props.ErrorHandler.setBreadcrumb("Create Event Modal");
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  setValue = ({ name, value }) => {
    if (this.mounted) {
      this.setState({ [name]: value }, () => {
        if (!isEmpty(this.state.errors)) {
          this.validateForm();
        }
      });
    }
  };

  setPhoto = value => {
    if (this.mounted) {
      this.setState({ image: value[0] });
    }
  };

  validateForm = async () => {
    try {
      if (this.mounted) {
        await this.schema.validate(this.state, { abortEarly: false });
        this.setState({ errors: {} });
      }
      return true;
    } catch (e) {
      let errors = {};
      console.error(e);
      e.inner.forEach(err => (errors[err.path] = err.message));
      this.setState({ errors });
      return false;
    }
  };
  InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: "red" }}>
        {error}
      </div>
    ) : null;

  toggleKinksPopup = () => {
    if (this.mounted) {
      this.setState({
        showKinksPopup: !this.state.showKinksPopup
      });
    }
  };
  toggleKinks = ({ checked, value, updateSettings }) => {
    const { kinks } = this.state;

    if (this.mounted) {
      if (checked) {
        this.setState({ kinks: [...kinks, value] });
      } else {
        this.setState({ kinks: kinks.filter(kink => kink !== value) });
      }
    }
  };

  handleSubmit = async ({ createEvent, signS3 }) => {
    const { t, ErrorHandler, refetch, close, history, ReactGA } = this.props;
    if (await this.validateForm()) {
      if (!toast.isActive("savingeve")) {
        toast(t("savingeve"), {
          toastId: "savingeve"
        });
      }
      if (this.state.image && this.state.image.name !== undefined) {
        await this.handleUpload({ signS3 });
      }
      createEvent()
        .then(({ data }) => {
          toast.update("savingeve", {
            render: t("evevtsaved"),
            type: toast.TYPE.SUCCESS,
            autoClose: 2000
          });

          close();

          if (refetch) {
            ReactGA.event({
              category: "Event",
              action: "Update"
            });
            refetch();
          } else {
            ReactGA.event({
              category: "Event",
              action: "Create"
            });
            history.push("/event/" + data.createEvent.id);
          }
        })
        .catch(res => {
          ErrorHandler.catchErrors(res);
        });
    }
  };

  handleUpload = async ({ signS3 }) => {
    const { image: file } = this.state;
    if (file === "") {
      return;
    }

    await this.setS3PhotoParams(file.name, file.type);

    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key } = data.signS3;
        if (signedRequest === "https://s3.amazonaws.com/") {
          this.props.ErrorHandler.catchErrors({
            error: "ERROR: File not loaded properly. File object:",
            file
          });
        }
        await this.uploadToS3(file, signedRequest);
        if (this.mounted) {
          this.setState({ image: key, isImageAlt: true });
        }
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res);
      });
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
    try {
      //ORIGINAL
      const options = {
        headers: {
          "Content-Type": file.type
        }
      };
      const resp = await axios.put(signedRequest, file, options);
      if (resp.status !== 200) {
        toast.error(this.props.t("uploaderror"));
      }
    } catch (e) {
      this.props.ErrorHandler.catchErrors(e);
    }
  };

  setLocationValues = ({ lat, long, address }) => {
    if (lat && long) {
      if (this.mounted) {
        return this.setState({ lat, long, address });
      }
    }
    if (this.mounted) {
      this.setState({ address });
    }
    if (!isEmpty(this.state.errors)) {
      this.validateForm();
    }
  };
  togglePage = () => {
    if (this.mounted) {
      this.setState({
        showInfo: !this.state.showInfo
      });
    }
  };

  handleClickOnRemoveCurrentImage = () => {
    this.setState({
      image: "",
      removeCurrentImage: false,
      setOlderImage: true,
      isImageAlt: true
    });
  };

  handleClickOnResetImage = () => {
    this.setState({
      image: this.props.updateEventProps.image,
      removeCurrentImage: true,
      setOlderImage: false,
      isImageAlt: false
    });
  };

  render() {
    const { close, t, ErrorHandler, eventID, lang, tReady, dayjs } = this.props;
    const {
      eventname,
      tagline,
      kinks,
      interestedIn,
      description,
      address,
      type,
      lat,
      long,
      startTime,
      endTime,
      image,
      showKinksPopup,
      errors,
      showInfo,
      filetype,
      removeCurrentImage,
      setOlderImage,
      isImageAlt
    } = this.state;
    if (!tReady) {
      return null;
    }
    return (
      <section>
        <Modal
          header={eventID ? t("updateeve") : t("createeve")}
          close={close}
          disableOffClick
          className="create-event"
        >
          <ErrorHandler.ErrorBoundary>
            <div className="m-body">
              <div className="page">
                <div className="settings-content">
                  {showInfo ? (
                    <div className="content">
                      <div className="item">
                        <div className="input">
                          <input
                            type="text"
                            tabIndex="1"
                            required
                            id="eventname"
                            onChange={el =>
                              this.setValue({
                                name: "eventname",
                                value: el.target.value
                              })
                            }
                            value={eventname || ""}
                          />
                          <label title={t("evename")} htmlFor="eventname" />
                        </div>
                        {this.InputFeedback(t(errors.eventname))}
                      </div>
                      <div className="item">
                        <div className="input">
                          <input
                            type="text"
                            tabIndex="2"
                            required
                            id="tagline"
                            onChange={el =>
                              this.setValue({
                                name: "tagline",
                                value: el.target.value
                              })
                            }
                            value={tagline || ""}
                          />
                          <label title={t("tagline")} htmlFor="tagline" />
                        </div>
                      </div>
                      <div className="item">
                        <div className="textarea">
                          <textarea
                            tabIndex="3"
                            placeholder={t("desctitle") + "..."}
                            onChange={el =>
                              this.setValue({
                                name: "description",
                                value: el.target.value
                              })
                            }
                            value={description}
                          />
                        </div>
                        {this.InputFeedback(t(errors.description))}
                      </div>
                      <div className="item">
                        <KinksSelector
                          kinks={kinks}
                          togglePopup={this.toggleKinksPopup}
                          ErrorBoundary={ErrorHandler.ErrorBoundary}
                          t={t}
                          isEvent={true}
                        />
                      </div>
                      <div className="item">
                        <Dropdown
                          value={type}
                          type={"eventType"}
                          onChange={e => {
                            this.setValue({
                              name: "type",
                              value: e.value
                            });
                          }}
                          placeholder={t("evetype") + ":"}
                          lang={lang}
                          noClass={true}
                        />
                      </div>
                      {this.InputFeedback(t(errors.type))}
                      <div className="item nobottom">
                        {eventID && removeCurrentImage ? (
                          <div
                            style={{
                              height: "78px",
                              marginBottom: "14px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              background: "#f1f0ef",
                              borderRadius: "9px"
                            }}
                            onClick={this.handleClickOnRemoveCurrentImage}
                          >
                            {t("removecurr")}
                          </div>
                        ) : (
                          <Fragment>
                            <PhotoUpload
                              photos={image && [image]}
                              setPhotos={el => {
                                this.setPhoto(el);
                              }}
                            />
                            {eventID && setOlderImage && (
                              <div
                                style={{ padding: "4px", textAlign: "right" }}
                                onClick={this.handleClickOnResetImage}
                              >
                                {t("setoldimg")}
                              </div>
                            )}
                          </Fragment>
                        )}
                      </div>
                      <div className="item">
                        <div className="button mtop">
                          <button onClick={this.togglePage} id="next-btn">
                            {t("common:Next")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="content">
                      <div className="item">
                        <AddressSearch
                          style={{
                            width: "100%"
                          }}
                          setLocationValues={({ lat, long, address }) =>
                            this.setLocationValues({
                              lat,
                              long,
                              address
                            })
                          }
                          address={address}
                          type={"address"}
                          placeholder={t("common:Address")}
                          hideReset={true}
                          ErrorHandler={ErrorHandler}
                        />
                      </div>
                      {this.InputFeedback(t(errors.address))}
                      <div className="item">
                        <div className="input calender calender-input-sm">
                          <DateTimePicker
                            autoOk
                            disablePast
                            emptyLabel={t("evestart")}
                            InputProps={{
                              disableUnderline: true
                            }}
                            classes={{ root: "datePickerInput" }}
                            value={startTime}
                            onChange={e => {
                              if (endTime && dayjs(e).isAfter(dayjs(endTime))) {
                                if (!toast.isActive("startTime")) {
                                  toast.info(t("setstart"), {
                                    position: toast.POSITION.TOP_CENTER,
                                    toastId: "startTime"
                                  });
                                }
                                return;
                              }

                              this.setValue({
                                name: "startTime",
                                value: e
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="item">
                        <div className="input calender calender-input-sm">
                          <DateTimePicker
                            autoOk
                            emptyLabel={t("eveend")}
                            InputProps={{
                              disableUnderline: true
                            }}
                            classes={{ root: "datePickerInput" }}
                            value={endTime}
                            disablePast
                            onChange={e => {
                              if (
                                startTime &&
                                dayjs(startTime).isAfter(dayjs(e))
                              ) {
                                if (!toast.isActive("endTime")) {
                                  toast.info(t("setend"), {
                                    position: toast.POSITION.TOP_CENTER,
                                    toastId: "endTime"
                                  });
                                }
                                return;
                              }

                              this.setValue({
                                name: "endTime",
                                value: e.toISOString()
                              });
                            }}
                          />
                        </div>
                      </div>
                      {!isEmpty(this.state.errors) && (
                        <div
                          style={{
                            textAlign: "center"
                          }}
                        >
                          {this.InputFeedback(t("fixreq"))}
                        </div>
                      )}
                      <div className="item">
                        <div className="submit">
                          <Mutation mutation={SIGNS3} variables={{ filetype }}>
                            {signS3 => {
                              return (
                                <Mutation
                                  mutation={CREATE_EVENT}
                                  variables={{
                                    eventname,
                                    kinks,
                                    interestedIn,
                                    description,
                                    tagline,
                                    address,
                                    type,
                                    lat,
                                    long,
                                    startTime,
                                    endTime,
                                    image,
                                    eventID,
                                    isImageAlt
                                  }}
                                >
                                  {(createEvent, { loading }) => {
                                    return (
                                      <span
                                        className="color"
                                        onClick={() =>
                                          this.handleSubmit({
                                            createEvent,
                                            signS3
                                          })
                                        }
                                        id="create-btn"
                                      >
                                        {eventID
                                          ? t("common:updateevent")
                                          : t("common:createevent")}
                                      </span>
                                    );
                                  }}
                                </Mutation>
                              );
                            }}
                          </Mutation>
                          <span className="border" onClick={this.togglePage}>
                            {t("Back")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ErrorHandler.ErrorBoundary>
        </Modal>

        {showKinksPopup && (
          <KinksModal
            close={this.toggleKinksPopup}
            onChange={e => this.toggleKinks(e)}
            kinks={kinks}
            ErrorBoundary={ErrorHandler.ErrorBoundary}
            isEvent={true}
          />
        )}
      </section>
    );
  }
}
export default withTranslation("modals")(CreateEvent);
