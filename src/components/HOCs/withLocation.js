import React, { Fragment, PureComponent } from "react";
import i18next from "i18next";
import SetLocationModal from "../Modals/SetLocation";
import getCityCountry from "../../utils/getCityCountry";

const withLocation = PassedComponent =>
  class withLocation extends PureComponent {
    state = {
      lat: undefined,
      long: undefined,
      city: "",
      country: "",
      locModalVisible: false
    };

    showConfirm = (setLocModalVisible, caller) => {
      const { t } = i18next;
      setLocModalVisible(true);
    };

    findLocation = (setLocation, setLocModalVisible, caller) => {
      if (!navigator.geolocation) {
        alert(i18next.t("geonotlocated"));
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
      if (this.mounted) {
        this.setState({ locModalVisible: visible });
      }
    };
    setLocation = async pos => {
      var crd = pos.coords;
      const { long, lat } = this.state;

      if (long !== crd.longitude && lat !== crd.latitude) {
        const citycntry = await getCityCountry({
          long: crd.longitude,
          lat: crd.latitude
        });

        if (citycntry === null) {
          const { toast } = require("react-toastify");
          toast.error("Location error, please set your location in settings");
        } else {
          if (this.mounted) {
            this.setState({
              long: crd.longitude,
              lat: crd.latitude,
              city: citycntry.city,
              country: citycntry.country
            });
          }
        }
      }
      await this.props.refetch();
    };

    componentDidMount() {
      this.checkLocation();
      this.mounted = true;
    }
    componentWillUnmount() {
      this.mounted = false;
    }

    checkLocation() {
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
      const { lat, long, city, country, locModalVisible } = this.state;

      return (
        <Fragment>
          <PassedComponent
            {...this.props}
            location={{ lat, long, city, country }}
            locationErr={
              !lat ? (
                <section className="not-found">
                  <div className="container">
                    <div className="col-md-12">
                      <div className="icon">
                        <i className="nico location" />
                      </div>
                      <span className="head">Location not available.</span>
                      <span className="description">
                        Please enable location services on your device to see
                        this page.
                      </span>
                    </div>
                  </div>
                </section>
              ) : null
            }
          />
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

export default withLocation;
