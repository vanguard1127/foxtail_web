import React, { Fragment } from "react";
import { withNamespaces } from "react-i18next";
import SetLocationModal from "./Modals/SetLocation";

const withLocation = PassedComponent =>
  class withLocation extends React.Component {
    state = {
      lat: null,
      long: null,
      locModalVisible: false
    };

    //TODO: Change messaging for Black
    showConfirm = (setLocModalVisible, caller) => {
      const { t } = this.props;
      setLocModalVisible(true);
      //TODO: unlock when dialog made
      // confirm({
      //   title: t("enableloc"),
      //   content: t("locuse"),
      //   cancelText: t("cantshare"),
      //   onOk() {
      //     caller.checkLocation();
      //   },
      //   onCancel() {
      //     setLocModalVisible(true);
      //   }
      // });
    };

    findLocation = (setLocation, setLocModalVisible, caller) => {
      if (!navigator.geolocation) {
        alert(this.props.t("geonotlocated"));
        const session = this.props.session;
        if (session && session.location) {
          this.setLocation({
            coords: {
              longitude: session.location.crds.log,
              latitude: session.location.crds.lat
            }
          });
        }
        this.showConfirm(setLocModalVisible, caller);
      }
      //Location needs to be enabled or set
      navigator.geolocation.getCurrentPosition(setLocation, err => {
        const session = this.props.session;
        if (session) {
          const user = session.currentuser;
          if (
            user &&
            user.location.crds &&
            user.location.crds.lat !== null &&
            user.location.crds.long !== null
          ) {
            return this.setLocation({
              coords: {
                longitude: user.location.crds.long,
                latitude: user.location.crds.lat
              }
            });
          }
        }
        this.showConfirm(setLocModalVisible, caller);
      });
    };

    setLocModalVisible = visible => {
      this.setState({ locModalVisible: visible });
    };
    setLocation = async pos => {
      var crd = pos.coords;
      const { long, lat } = this.state;
      if (long !== crd.longitude && lat !== crd.latitude) {
        this.setState({ long: crd.longitude, lat: crd.latitude });
      }
      await this.props.refetch();
    };

    componentDidMount() {
      this.checkLocation();
    }

    checkLocation() {
      //TODO:Delete this:
      return this.setLocation({
        coords: {
          longitude: 45,
          latitude: 45
        }
      });

      try {
        if (
          this.props.session &&
          this.props.session.currentuser &&
          this.props.session.currentuser.blackMember &&
          this.props.session.currentuser.location.crds.lat
        ) {
          return this.setLocation({
            coords: {
              longitude: this.props.session.currentuser.location.crds.long,
              latitude: this.props.session.currentuser.location.crds.lat
            }
          });
        }
        this.findLocation(this.setLocation, this.setLocModalVisible, this);
      } catch (e) {
        throw new Error(e.message);
      }
    }

    render() {
      const { lat, long, locModalVisible } = this.state;

      return (
        <Fragment>
          {lat !== null && (
            <PassedComponent {...this.props} location={{ lat, long }} />
          )}
          {locModalVisible && (
            <SetLocationModal
              close={() => this.setLocModalVisible(false)}
              setLocation={this.setLocation}
              isBlackMember={this.props.session.currentuser.blackMember.active}
            />
          )}
        </Fragment>
      );
    }
  };

export default withNamespaces("common")(withLocation);
