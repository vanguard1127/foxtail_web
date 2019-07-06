import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import * as yup from "yup";
import axios from "axios";
import { Mutation } from "react-apollo";
import { SIGNS3, CREATE_EVENT } from "../../../queries";
import PhotoUpload from "../../common/PhotoUpload";
import DesiresModal from "../../Modals/Desires/Modal";
import DesiresSelector from "../../Modals/Desires/Selector";
import AddressSearch from "../../common/AddressSearch";
import DatePicker from "../../common/DatePicker";
import Modal from "../../common/Modal";
import isEmpty from "../../../utils/isEmpty";
import { toast } from "react-toastify";
import Dropdown from "../../common/Dropdown";

class CreateEvent extends Component {
  schema = yup.object().shape({
    eventname: yup
      .string()
      .min(3, this.props.t("eve3char"))
      .max(120, this.props.t("eve120"))
      .required(this.props.t("evereq")),
    description: yup
      .string()
      .min(10, this.props.t("dec10char"))
      .max(500, this.props.t("dec500"))
      .required(this.props.t("decreq")),
    type: yup.string().required(this.props.t("evetypereq")),
    address: yup
      .string()
      .max(240, this.props.t("dec240"))
      .required(this.props.t("addreq"))
  });
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.eventname !== nextState.eventname ||
      this.state.tagline !== nextState.tagline ||
      this.state.description !== nextState.description ||
      this.state.desires !== nextState.desires ||
      this.state.desires.length !== nextState.desires.length ||
      this.state.address !== nextState.address ||
      this.state.image.name !== nextState.image.name ||
      this.state.startTime !== nextState.startTime ||
      this.state.endTime !== nextState.endTime ||
      this.state.interestedIn.length !== nextState.interestedIn.length ||
      this.state.showInfo !== nextState.showInfo ||
      this.state.showDesiresPopup !== nextState.showDesiresPopup ||
      this.state.type !== nextState.type ||
      this.state.errors !== nextState.errors ||
      this.state.removeCurrentImage !== nextState.removeCurrentImage ||
      this.props.t !== nextProps.t
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
    desires: [],
    lat: null,
    long: null,
    address: "",
    image: "",
    type: "",
    startTime: "",
    endTime: "",
    interestedIn: [],
    errors: {},
    showInfo: true,
    showDesiresPopup: false,
    removeCurrentImage: this.props.updateEventProps
      ? !!this.props.updateEventProps.image
      : false,
    setOlderImage: false,
    ...this.props.updateEventProps
  };

  componentDidMount() {
    this.mounted = true;
    this.props.ErrorHandler.setBreadcrumb("Create Event Modal");

    this.textInput.focus();
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

  toggleDesiresPopup = () => {
    if (this.mounted) {
      this.setState({
        showDesiresPopup: !this.state.showDesiresPopup
      });
    }
  };
  toggleDesires = ({ checked, value, updateSettings }) => {
    const { desires } = this.state;

    if (this.mounted) {
      if (checked) {
        this.setState({ desires: [...desires, value] });
      } else {
        this.setState({ desires: desires.filter(desire => desire !== value) });
      }
    }
  };

  handleSubmit = async ({ createEvent, signS3 }) => {
    const { t, ErrorHandler, refetch, close, history, ReactGA } = this.props;
    if (await this.validateForm()) {
      if (this.state.image !== "") {
        await this.handleUpload({ signS3 });
      }
      createEvent()
        .then(async ({ data }) => {
          toast.success(t("evevtsaved"));

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
          close();
        })
        .catch(res => {
          ErrorHandler.catchErrors(res.graphQLErrors);
        });
    }
  };

  handleUpload = async ({ signS3 }) => {
    const { image } = this.state;
    if (image === "") {
      return;
    }

    const file = image;

    await this.setS3PhotoParams(file.name, file.type);

    await signS3()
      .then(async ({ data }) => {
        const { signedRequest, key } = data.signS3;
        await this.uploadToS3(file, signedRequest);
        if (this.mounted) {
          this.setState({ image: key });
        }
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
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
      setOlderImage: true
    });
  };

  handleClickOnResetImage = () => {
    this.setState({
      image: this.props.updateEventProps.image,
      removeCurrentImage: true,
      setOlderImage: false
    });
  };

  render() {
    const { close, t, ErrorHandler, eventID, lang } = this.props;
    const {
      eventname,
      tagline,
      desires,
      interestedIn,
      description,
      address,
      type,
      lat,
      long,
      startTime,
      endTime,
      image,
      showDesiresPopup,
      errors,
      showInfo,
      filename,
      filetype,
      removeCurrentImage,
      setOlderImage
    } = this.state;

    return (
      <section>
        <Modal header={eventID ? t("updateeve") : t("createeve")} close={close}>
          <ErrorHandler.ErrorBoundary>
            <div className="m-body">
              <div className="page">
                <div className="form">
                  {showInfo && (
                    <div className="content">
                      <div className="item">
                        <div className="input">
                          <input
                            type="text"
                            required
                            id="eventname"
                            onChange={el =>
                              this.setValue({
                                name: "eventname",
                                value: el.target.value
                              })
                            }
                            value={eventname || ""}
                            ref={input => {
                              this.textInput = input;
                            }}
                          />
                          <label title={t("evename")} htmlFor="eventname" />
                        </div>
                        {this.InputFeedback(errors.eventname)}
                      </div>
                      <div className="item">
                        <div className="input">
                          <input
                            type="text"
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
                        {this.InputFeedback(errors.description)}
                      </div>
                      <div className="item">
                        <DesiresSelector
                          desires={desires}
                          togglePopup={this.toggleDesiresPopup}
                          ErrorBoundary={ErrorHandler.ErrorBoundary}
                          t={t}
                        />
                      </div>
                      <div className="item">
                        <Dropdown
                          value={type}
                          type={"eventType"}
                          onChange={async e => {
                            await this.setValue({
                              name: "type",
                              value: e.value
                            });
                          }}
                          placeholder={t("evetype") + ":"}
                          lang={lang}
                          noClass={true}
                        />
                      </div>
                      {this.InputFeedback(errors.type)}
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
                            Remove Current Image
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
                                Set older Image
                              </div>
                            )}
                          </Fragment>
                        )}
                      </div>
                      <div className="item">
                        <div className="button mtop">
                          <button onClick={() => this.togglePage()}>
                            {t("common:Next")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {!showInfo && (
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
                      {this.InputFeedback(errors.address)}
                      <div className="item">
                        <DatePicker
                          value={startTime}
                          p={{
                            maxDate: new Date(endTime) || null,
                            minDate: new Date()
                          }}
                          onChange={e => {
                            this.setValue({
                              name: "startTime",
                              value: e
                            });
                          }}
                          t={t}
                          type="datetime"
                          placeholder={t("evestart")}
                        />
                      </div>
                      <div className="item">
                        <DatePicker
                          value={endTime}
                          p={{ minDate: new Date(startTime) || new Date() }}
                          onChange={e => {
                            this.setValue({
                              name: "endTime",
                              value: e
                            });
                          }}
                          t={t}
                          placeholder={t("eveend")}
                          type="datetime"
                        />
                      </div>
                      {!isEmpty(this.state.errors) && (
                        <div
                          style={{
                            textAlign: "center"
                          }}
                        >
                          {" "}
                          {this.InputFeedback(t("fixreq"))}
                        </div>
                      )}
                      <div className="item">
                        <div className="submit">
                          {" "}
                          <Mutation
                            mutation={SIGNS3}
                            variables={{ filename, filetype }}
                          >
                            {signS3 => {
                              return (
                                <Mutation
                                  mutation={CREATE_EVENT}
                                  variables={{
                                    eventname,
                                    desires,
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
                                    eventID
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
                          <span
                            className="border"
                            onClick={() => this.togglePage()}
                          >
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

        {showDesiresPopup && (
          <DesiresModal
            close={this.toggleDesiresPopup}
            onChange={e => this.toggleDesires(e)}
            desires={desires}
            ErrorBoundary={ErrorHandler.ErrorBoundary}
          />
        )}
      </section>
    );
  }
}
export default withTranslation("modals")(CreateEvent);
