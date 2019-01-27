import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import PhotoUpload from "../../common/PhotoUpload";
import DesiresModal from "../../Modals/Desires/Modal";
import DesiresSelector from "../../Modals/Desires/Selector";
import Select from "../../common/Select";
import AddressSearch from "../../common/AddressSearch";
import DateTimePicker from "../../common/DatePicker/DateTimePicker";
class CreateEvent extends Component {
  state = {
    filename: "",
    filetype: "",
    photoKey: "",
    showDesiresPopup: false,
    desires: [],
    lat: "",
    long: "",
    address: "",
    photo: [],
    image: "",
    type: "",
    time: "",
    interestedIn: [],
    validating: "",
    eventname: ""
  };

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };
  setPhotos = photos => {
    this.setState({ photos });
  };
  toggleDesiresPopup = () => {
    this.setState({
      showDesiresPopup: !this.state.showDesiresPopup
    });
  };
  toggleDesires = ({ checked, value, updateSettings }) => {
    const { desires } = this.state;

    if (checked) {
      this.setState({ desires: [...desires, value] });
    } else {
      this.setState({ desires: desires.filter(desire => desire !== value) });
    }
  };
  setLocationValues = ({ lat, long, address }) => {
    if (lat && long) {
      return this.setState({ lat, long, address });
    }
    this.setState({ address });
  };
  render() {
    const { closePopup, t, ErrorBoundary } = this.props;
    const {
      photo,
      showDesiresPopup,
      desires,
      eventname,
      interestedIn,
      description,
      address,
      type
    } = this.state;
    return (
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup create-event">
                  <ErrorBoundary>
                    <div className="m-head">
                      <span className="heading">{t("createeve")}</span>
                      <span className="title">{t("common:eventsubtitle")}</span>
                      <span className="close" onClick={() => closePopup()} />
                    </div>
                    <div className="m-body">
                      <div className="page">
                        <div className="form">
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
                                      value: el
                                    })
                                  }
                                />
                                <label
                                  title={t("evename")}
                                  htmlFor="eventname"
                                />
                              </div>
                            </div>
                            <div className="item">
                              <div className="input">
                                <DateTimePicker />
                              </div>
                            </div>
                            <div className="item">
                              <div className="input">
                                <AddressSearch
                                  style={{ width: "100%" }}
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
                                />
                                {/* <input
                                type="text"
                                required
                                id="eventAddress"
                                onChange={el =>
                                  this.setValue({
                                    name: "photo",
                                    value: el
                                  })
                                }
                              />
                              <label
                                title="Event Address"
                                htmlFor="eventAddress"
                              /> */}
                              </div>
                            </div>
                            <div className="item">
                              <div className="textarea">
                                <textarea
                                  placeholder={t("desctitle") + "..."}
                                  onChange={el =>
                                    this.setValue({
                                      name: "photo",
                                      value: el
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="item nobottom">
                              <PhotoUpload
                                photos={photo}
                                setPhotos={el =>
                                  this.setValue({
                                    name: "photo",
                                    value: el
                                  })
                                }
                              />
                            </div>
                            <div className="item">
                              <DesiresSelector
                                desires={desires}
                                togglePopup={() => this.toggleDesiresPopup()}
                                ErrorBoundary={ErrorBoundary}
                              />
                            </div>
                            <div className="item">
                              <Select
                                label={t("evetype") + ":"}
                                onChange={el =>
                                  this.setValue({
                                    name: "type",
                                    value: el
                                  })
                                }
                                value={type}
                                options={[
                                  { label: "Public", value: "public" },
                                  { label: "Private", value: "private" },
                                  { label: "Request", value: "request" }
                                ]}
                              />
                            </div>
                            <div className="item">
                              <div className="button mtop">
                                <button>{t("common:createevent")}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showDesiresPopup && (
          <DesiresModal
            closePopup={() => this.toggleDesiresPopup()}
            onChange={e => this.toggleDesires(e)}
            desires={desires}
            ErrorBoundary={ErrorBoundary}
          />
        )}
      </section>
    );
  }
}
export default withNamespaces("modals")(CreateEvent);
