import React, { PureComponent } from "react";
import { withNamespaces } from "react-i18next";
import * as yup from "yup";
import axios from "axios";
import { Mutation } from "react-apollo";
import { SIGNS3, CREATE_EVENT, SEARCH_EVENTS } from "../../../queries";
import PhotoUpload from "../../common/PhotoUpload";
import DesiresModal from "../../Modals/Desires/Modal";
import DesiresSelector from "../../Modals/Desires/Selector";
import Select from "../../common/Select";
import AddressSearch from "../../common/AddressSearch";
import DatePicker from "../../common/DatePicker";
import Modal from "../../common/Modal";
import isEmpty from "../../../utils/isEmpty";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  eventname: yup
    .string()
    .min(3, "Event Name must be at least 3 characters")
    .max(120, "Event Name must be less than 120 characters")
    .required("Event Name is required!"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required!"),
  type: yup.string().required("Event Type is required!"),
  address: yup
    .string()
    .max(240, "Description must be less than 240 characters")
    .required("Address is required!")
});
class CreateEvent extends PureComponent {
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
    images: [],
    image: "",
    type: "",
    startTime: "",
    endTime: "",
    interestedIn: [],
    errors: {},
    showInfo: true,
    showDesiresPopup: false,
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

  validateForm = async () => {
    try {
      if (this.mounted) {
        await schema.validate(this.state, { abortEarly: false });
        this.setState({ errors: {} });
      }
      return true;
    } catch (e) {
      //TODO: Erorr handler here
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

  //TODO: SETUP ERRORS ON THIS PAGE
  handleSubmit = async ({ createEvent, signS3 }) => {
    if (await this.validateForm()) {
      if (this.state.images.length > 0) {
        await this.handleUpload({ signS3 });
      }
      createEvent()
        .then(async ({ data }) => {
          toast.success("Event Saved!");
          if (this.props.refetch) {
            this.props.refetch();
          }
          this.props.close();
        })
        .catch(res => {
          console.log("3", res);
        });
    }
  };

  //TODO: Are all of these async await needed?
  handleUpload = async ({ signS3 }) => {
    const { images } = this.state;
    if (images.length === 0) {
      return;
    }

    const file = images[0];

    await this.setS3PhotoParams(file.name, file.type);
    //format name on backend
    //filename: this.formatFilename(file.name),
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
      if (resp.status === 200) {
        console.log("upload ok");
      } else {
        console.log("Something went wrong");
      }
    } catch (e) {
      console.log(e);
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
  //TODO: Min time for date pickers to prevent time overlap
  render() {
    const { close, t, ErrorHandler, eventID } = this.props;
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
      images,
      image,
      showDesiresPopup,
      errors,
      showInfo,
      filename,
      filetype
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
                        />
                      </div>
                      <div className="item">
                        <Select
                          label={t("evetype") + ":"}
                          onChange={el =>
                            this.setValue({
                              name: "type",
                              value: el.value
                            })
                          }
                          value={type}
                          defaultOptionValue={type}
                          options={[
                            { label: "Public", value: "public" },
                            { label: "Private", value: "private" },
                            { label: "Request", value: "request" }
                          ]}
                        />
                      </div>
                      {this.InputFeedback(errors.type)}
                      <div className="item nobottom">
                        <PhotoUpload
                          photos={image && [image]}
                          setPhotos={el =>
                            this.setValue({
                              name: "images",
                              value: el
                            })
                          }
                        />
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
                          {this.InputFeedback(
                            "Please fix the required fields on both pages"
                          )}
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
                            Back
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
export default withNamespaces("modals")(CreateEvent);
