import React, { Component } from "react";
import { Modal, message } from "antd";
import { UPDATE_SETTINGS } from "../../queries";
import { Mutation } from "react-apollo";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import AddressSearch from "../common/AddressSearch";

class SetLocationModal extends Component {
  state = { locationLock: "", long: null, lat: null };

  handleTextChange = locationLock => {
    this.setState({ locationLock });
  };

  handleSubmit = updateSettings => {
    updateSettings()
      .then(({ data }) => {
        if (data.updateSettings) {
          this.props.setLocation({
            coords: {
              longitude: this.state.long,
              latitude: this.state.lat
            }
          });
          message.success("Location set to: " + this.state.locationLock);
          this.props.refetch();
          this.props.close();
        } else {
          message.error("Location not set! Please contact support.");
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
  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => {
        return getLatLng(results[0]);
      })
      .then(latLng => {
        this.setState({
          lat: latLng.lat,
          long: latLng.lng,
          validating: "success",
          locationLock: address
        });
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };
  render() {
    const { visible, close } = this.props;

    const { locationLock, lat, long } = this.state;
    return (
      <Mutation
        mutation={UPDATE_SETTINGS}
        variables={{
          locationLock,
          lat,
          long
        }}
      >
        {updateSettings => {
          return (
            <Modal
              title={"Set Location - Courtesy"}
              centered
              visible={visible}
              onOk={() => this.handleSubmit(updateSettings)}
              onCancel={close}
              okButtonProps={{ disabled: lat === null }}
            >
              Select a City:
              <AddressSearch
                style={{ width: "100%" }}
                onSelect={this.handleSelect}
                onChange={this.handleTextChange}
                value={locationLock}
                type={"(cities)"}
              />
              <small>
                *You can only do this once since you do not have location
                services enabled. <br />
                To change your location in the future, you must either enable
                location services or signup for Black membership.
              </small>
            </Modal>
          );
        }}
      </Mutation>
    );
  }
}

export default SetLocationModal;