import React, { Component } from "react";
import { UPDATE_LOCATION } from "../../../queries";
import { Mutation } from "react-apollo";
import AddressSearch from "../../common/AddressSearch";
import { ErrorBoundary, catchErrors } from "../../common/ErrorHandler";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import Spinner from "../../common/Spinner";
import { toast } from "react-toastify";

class SetLocationModal extends Component {
  state = { address: "", long: null, lat: null };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.address !== nextState.address ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }

  setLocationValues = pos => {
    const { lat, long, address } = pos;

    if (lat && long) {
      if (this.mounted) {
        return this.setState({ lat, long, address });
      }
    }
    if (this.mounted) {
      return this.setState({ address });
    }
  };

  handleSubmit = updateLocation => {
    const { t } = this.props;
    updateLocation()
      .then(async ({ data }) => {
        if (data.updateLocation) {
          this.props.setLocation({
            coords: {
              longitude: this.state.long,
              latitude: this.state.lat
            },
            city: this.state.address
          });
          toast.success(t("locset") + ": " + this.state.address);
          this.props.close();
        } else {
          toast.error(t("locnotset"));
        }
      })
      .catch(res => {
        catchErrors(res.graphQLErrors);
      });
  };

  handleRemoveLocLock = async updateLocation => {
    await navigator.geolocation.getCurrentPosition(
      pos => this.setLocation(pos, updateLocation),
      err => {
        alert(this.props.t("common:enablerem"));
        return;
      }
    );
  };

  render() {
    const { close, isBlackMember, t, tReady } = this.props;

    const { address, lat, long } = this.state;

    if (!tReady) {
      return (
        <Modal close={close}>
          <Spinner />
        </Modal>
      );
    }
    return (
      <Mutation
        mutation={UPDATE_LOCATION}
        variables={{
          city: address,
          lat,
          long
        }}
      >
        {updateLocation => {
          return (
            <Modal
              header={t("common:setloc")}
              close={close}
              description={
                !isBlackMember && (
                  <small>
                    {t("compmsg")}
                    <br />
                    {t("compsecmsg")}
                  </small>
                )
              }
              okSpan={
                lat !== null ? (
                  <span
                    onClick={() => this.handleSubmit(updateLocation)}
                    disabled={lat === null}
                    className="color"
                  >
                    {t("Save")}
                  </span>
                ) : null
              }
            >
              <ErrorBoundary>
                <div className="m-body">
                  {t("setcity")}:
                  <AddressSearch
                    style={{ width: "100%" }}
                    setLocationValues={this.setLocationValues}
                    address={address}
                    type={"(cities)"}
                    placeholder={t("common:setloc") + "..."}
                    handleRemoveLocLock={() =>
                      this.handleRemoveLocLock(updateLocation)
                    }
                  />
                </div>
              </ErrorBoundary>
            </Modal>
          );
        }}
      </Mutation>
    );
  }
}

export default withTranslation("modals")(SetLocationModal);
