import React, { Component } from "react";
import { UPDATE_SETTINGS } from "../../../queries";
import { Mutation } from "react-apollo";
import AddressSearch from "../../common/AddressSearch";
import { withNamespaces } from "react-i18next";

class SetLocationModal extends Component {
  state = { address: "", long: null, lat: null };

  setLocationValues = ({ lat, long, address }) => {
    if (lat && long) {
      return this.setState({ lat, long, address });
    }
    this.setState({ address });
  };

  handleSubmit = updateSettings => {
    updateSettings()
      .then(async ({ data }) => {
        if (data.updateSettings) {
          this.props.setLocation({
            coords: {
              longitude: this.state.long,
              latitude: this.state.lat
            },
            location: this.state.address
          });
          alert("Location set to: " + this.state.address);
          this.props.close();
        } else {
          alert("Location not set! Please turn on locations services.");
        }
      })
      .catch(res => {
        console.log(res);
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  render() {
    const { close, isBlackMember, t } = this.props;

    const { address, lat, long } = this.state;
    return (
      <Mutation
        mutation={UPDATE_SETTINGS}
        variables={{
          location: address,
          lat,
          long
        }}
      >
        {updateSettings => {
          return (
            <section className="popup-content show">
              <div className="container">
                <div className="col-md-12">
                  <div className="row">
                    <div className="offset-md-3 col-md-6">
                      <div className="modal-popup photo-verification">
                        <div className="m-head">
                          <span className="heading">{t("Set Location")}</span>
                          <span className="close" onClick={close} />
                        </div>
                        <div className="m-body">
                          {t("Select a city")}:
                          <AddressSearch
                            style={{ width: "100%" }}
                            setLocationValues={this.setLocationValues}
                            address={address}
                            type={"(cities)"}
                            placeholder={t("Set Location...")}
                          />
                          {lat !== null ? (
                            <button
                              onClick={() => this.handleSubmit(updateSettings)}
                              disabled={lat === null}
                            >
                              {t("Save")}
                            </button>
                          ) : null}
                        </div>
                        {!isBlackMember && (
                          <small>
                            {t(
                              "*You can only do this once since you do not have location services enabled."
                            )}
                            <br />
                            {t(
                              "To change your location in the future, you must either enable location services or signup for Black membership."
                            )}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }}
      </Mutation>
    );
  }
}

export default withNamespaces()(SetLocationModal);
