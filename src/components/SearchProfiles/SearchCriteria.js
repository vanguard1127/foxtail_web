import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { UPDATE_SETTINGS } from "../../queries";
import Dropdown from "../common/Dropdown";
import AddressSearch from "../common/AddressSearch";
import DistanceSlider from "../common/DistanceSlider";
import AgeRange from "../common/AgeRange";
import getCityCountry from "../../utils/getCityCountry";

class SearchCriteria extends PureComponent {
  state = {
    distance: this.props.distance,
    distanceMetric: this.props.distanceMetric,
    ageRange: this.props.ageRange,
    interestedIn: this.props.interestedIn,
    city: this.props.city,
    country: this.props.country,
    lat: this.props.lat,
    long: this.props.long
  };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  setLocation = async (pos, updateSettings) => {
    var crd = pos.coords;
    const { long, lat } = this.props;

    const citycntry = await getCityCountry({
      long: crd.longitude,
      lat: crd.latitude
    });

    if (long !== crd.longitude && lat !== crd.latitude) {
      await this.props.setLocation({
        long: crd.longitude,
        lat: crd.latitude,
        city: citycntry.city,
        country: citycntry.country
      });

      if (this.mounted) {
        this.setState(
          {
            long: crd.longitude,
            lat: crd.latitude,
            city: citycntry.city,
            country: citycntry.country
          },
          () => {
            if (updateSettings) {
              this.handleSubmit(updateSettings);
            }
          }
        );
      }
    }
  };

  handleSubmit = updateSettings => {
    updateSettings()
      .then(() => {
        {
          this.props.ReactGA.event({
            category: "Profile Search",
            action: "Change criteria"
          });
        }
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  handleRemoveLocLock = async updateSettings => {
    await navigator.geolocation.getCurrentPosition(
      pos => this.setLocation(pos, updateSettings),
      err => {
        alert(this.props.t("common:enablerem"));
        return;
      }
    );
  };

  setLocationValues = async ({ lat, long, city, updateSettings }) => {
    if (lat && long) {
      this.setLocation(
        {
          coords: {
            longitude: long,
            latitude: lat
          }
        },
        updateSettings
      );
    } else {
      this.props.setValue({ name: "city", value: city });

      if (this.mounted) {
        this.setState({ city });
      }
    }
  };

  setValue = ({ name, value, updateSettings }) => {
    this.props.setValue({ name, value });
    if (this.mounted) {
      this.setState({ [name]: value }, () => this.handleSubmit(updateSettings));
    }
  };

  render() {
    const { interestedIn } = this.state;
    const {
      t,
      loading,
      isBlackMember,
      lang,
      distance,
      distanceMetric,
      ageRange,

      city
    } = this.props;

    if (loading) {
      return (
        <Mutation
          mutation={UPDATE_SETTINGS}
          variables={{
            distance: this.state.distance,
            distanceMetric: this.state.distanceMetric,
            ageRange: this.state.ageRange,
            interestedIn: this.state.interestedIn,
            city: this.state.city,
            country: this.state.country,
            lat: this.state.lat,
            long: this.state.long
          }}
        >
          {updateSettings => {
            return (
              <section className="meet-filter">
                <div className="container">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="item">
                          <AddressSearch
                            style={{ width: 150 }}
                            setLocationValues={({ lat, long, address }) => {
                              this.setLocationValues({
                                lat,
                                long,
                                city: address,
                                updateSettings
                              });
                            }}
                            address={""}
                            type={"(cities)"}
                            placeholder={t("common:setloc") + "..."}
                            isBlackMember={isBlackMember}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="item">
                          <Dropdown
                            type={"interestedIn"}
                            onChange={el => null}
                            value={[]}
                            placeholder={t("common:Interested") + ":"}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <DistanceSlider value={0} setValue={null} t={t} />
                      </div>
                      <div className="col-md-6">
                        <AgeRange value={[18, 80]} setValue={null} t={t} />
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

    return (
      <>
        <Mutation
          mutation={UPDATE_SETTINGS}
          variables={{
            distance: this.state.distance,
            distanceMetric: this.state.distanceMetric,
            ageRange: this.state.ageRange,
            interestedIn: this.state.interestedIn,
            city: this.state.city,
            country: this.state.country,
            lat: this.state.lat,
            long: this.state.long
          }}
        >
          {updateSettings => {
            return (
              <section className="meet-filter">
                <div className="container">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="item">
                          <AddressSearch
                            style={{ width: 150 }}
                            setLocationValues={({ lat, long, address }) => {
                              this.setLocationValues({
                                lat,
                                long,
                                city: address,
                                updateSettings
                              });
                            }}
                            address={city}
                            type={"(cities)"}
                            placeholder={t("common:setloc") + "..."}
                            handleRemoveLocLock={() =>
                              this.handleRemoveLocLock(updateSettings)
                            }
                            isBlackMember={isBlackMember}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="item">
                          <Dropdown
                            type={"interestedIn"}
                            onChange={el =>
                              this.setState({
                                interestedIn: el.map(e => e.value)
                              })
                            }
                            onClose={() =>
                              this.setValue({
                                name: "interestedIn",
                                value: interestedIn,
                                updateSettings
                              })
                            }
                            value={interestedIn}
                            placeholder={t("common:Interested") + ":"}
                            lang={lang}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <DistanceSlider
                          value={distance}
                          setValue={el =>
                            this.setValue({
                              name: "distance",
                              value: el,
                              updateSettings
                            })
                          }
                          t={t}
                          metric={distanceMetric}
                        />
                      </div>
                      <div className="col-md-6">
                        <AgeRange
                          value={ageRange}
                          setValue={el =>
                            this.setValue({
                              name: "ageRange",
                              value: el,
                              updateSettings
                            })
                          }
                          t={t}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          }}
        </Mutation>
      </>
    );
  }
}

export default SearchCriteria;
