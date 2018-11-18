import React, { Fragment } from "react";
import { message, Modal } from "antd";
import SetLocationModal from "../components/common/SetLocationModal";
const confirm = Modal.confirm;

const withLocation = PassedComponent =>
  class withLocation extends React.Component {
    state = {
      lat: 0,
      long: 0,
      locModalVisible: false
    };

    showConfirm = (setLocModalVisible, caller) => {
      confirm({
        title: "Please enable location services if available.",
        content:
          "We use your location to show how far other members are from your for better matching. Turn on location services then click 'OK'",
        cancelText: "No, I can't share my location",
        onOk() {
          caller.checkLocation();
        },
        onCancel() {
          setLocModalVisible(true);
        }
      });
    };

    findLocation = (setLocation, setLocModalVisible, caller) => {
      if (!navigator.geolocation) {
        message.error(
          "Geolocation is not supported by this browser, Please click 'No'"
        );
        this.showConfirm(setLocModalVisible, caller);
      }
      navigator.geolocation.getCurrentPosition(setLocation, err => {
        this.showConfirm(setLocModalVisible, caller);
      });
    };

    setLocModalVisible = visible => {
      this.setState({ locModalVisible: visible });
    };
    setLocation = pos => {
      var crd = pos.coords;
      const { long, lat } = this.state;
      if (long !== crd.longitude && lat !== crd.latitude) {
        this.setState({ long: crd.longitude, lat: crd.latitude });
      }
    };

    componentDidMount() {
      this.checkLocation();
    }

    checkLocation() {
      this.findLocation(this.setLocation, this.setLocModalVisible, this);
    }

    render() {
      const { lat, long } = this.state;

      return (
        <Fragment>
          <PassedComponent {...this.props} location={{ lat, long }} />{" "}
          <SetLocationModal
            visible={this.state.locModalVisible}
            close={() => this.setLocModalVisible(false)}
          />
        </Fragment>
      );
    }
  };

export default withLocation;
