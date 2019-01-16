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
    const { t } = this.props;
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
          alert(t("locset") + ": " + this.state.address);
          this.props.close();
        } else {
          alert(t("locnotset"));
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
                          <span className="heading">{t("common:setloc")}</span>
                          <span className="close" onClick={close} />
                        </div>
                        <div className="m-body">
                          {t("setcity")}:
                          <AddressSearch
                            style={{ width: "100%" }}
                            setLocationValues={this.setLocationValues}
                            address={address}
                            type={"(cities)"}
                            placeholder={t("common:setloc") + "..."}
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
                            {t("compmsg")}
                            <br />
                            {t("compsecmsg")}
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
