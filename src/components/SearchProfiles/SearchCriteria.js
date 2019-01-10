import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import { UPDATE_SETTINGS, GET_SETTINGS, REMOVE_LOCLOCK } from "../../queries";
import Spinner from "../common/Spinner";
import AddressSearch from "../common/AddressSearch";
import SetLocationModal from "../common/SetLocationModal";
import { message } from "antd";
import DistanceSlider from "../common/DistanceSlider";
import InterestedInDropdown from "../common/InterestedInDropdown";
import AgeRange from "../common/AgeRange";

const CURRENT_LOC_LABEL = "My Location";

class SearchCriteria extends Component {
  state = {
    long: this.props.queryParams.long,
    lat: this.props.queryParams.lat,
    limit: this.props.queryParams.limit,
    locModalVisible: false,
    location: null,
    interestedIn: null,
    distance: null,
    distanceMetric: null,
    ageRange: null
  };

  setLocModalVisible = visible => {
    this.setState({ locModalVisible: visible });
  };

  //TODO: Refactor to use setValue
  setLocation = async pos => {
    var crd = pos.coords;
    var location = pos.location ? pos.location : CURRENT_LOC_LABEL;

    const { long, lat } = this.state;
    if (long !== crd.longitude && lat !== crd.latitude) {
      this.setState({ long: crd.longitude, lat: crd.latitude, location });
    }
  };

  handleSubmit = updateSettings => {
    updateSettings()
      .then(({ data }) => {
        const { lat, long } = this.state;
        //if null get location
        //TODO: REFRESH LIST HEREs
        this.props.setQueryLoc({ lat, long });
        this.props.refetch();
        // this.props.client.resetStore();
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  handleRemoveLocLock = (e, removeLocation) => {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition(this.setLocation, err => {
      message.error(
        "Please enable location services to remove your set location."
      );
      return;
    });

    removeLocation()
      .then(async ({ data }) => {
        this.props.form.setFieldsValue({ location: CURRENT_LOC_LABEL });
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  setLocationValues = ({ lat, long, address, updateSettings }) => {
    this.setState({ lat, long, location: address });
    if (lat && long) {
      this.handleSubmit(updateSettings);
    }
  };

  setValue = ({ name, value, updateSettings }) => {
    this.setState({ [name]: value });
    this.handleSubmit(updateSettings);
  };

  render() {
    let {
      lat,
      long,
      location,
      interestedIn,
      distance,
      distanceMetric,
      ageRange
    } = this.state;
    return (
      <div>
        <Query query={GET_SETTINGS} fetchPolicy="network-only">
          {({ data, loading, error }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            }
            if (error) {
              return <div>{error.message}</div>;
            }
            if (!data.getSettings) {
              return <div>Error occured. Please contact support!</div>;
            }

            distance = distance !== null ? distance : data.getSettings.distance;
            distanceMetric =
              distanceMetric !== null
                ? distanceMetric
                : data.getSettings.distanceMetric;
            ageRange = ageRange !== null ? ageRange : data.getSettings.ageRange;
            location = location !== null ? location : data.getSettings.location;
            interestedIn =
              interestedIn !== null
                ? interestedIn
                : data.getSettings.interestedIn;

            return (
              <Mutation mutation={REMOVE_LOCLOCK}>
                {(removeLocation, { loading }) => {
                  return (
                    <Mutation
                      mutation={UPDATE_SETTINGS}
                      variables={{
                        distance,
                        distanceMetric,
                        ageRange,
                        interestedIn,
                        location,
                        lat,
                        long
                      }}
                    >
                      {(updateSettings, { loading }) => {
                        return (
                          <section className="meet-filter">
                            <div className="container">
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="item">
                                      <AddressSearch
                                        style={{ width: 150 }}
                                        setLocationValues={({
                                          lat,
                                          long,
                                          address
                                        }) =>
                                          this.setLocationValues({
                                            lat,
                                            long,
                                            address,
                                            updateSettings
                                          })
                                        }
                                        address={location}
                                        type={"(cities)"}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="item">
                                      <InterestedInDropdown
                                        onChange={el =>
                                          this.setValue({
                                            name: "interestedIn",
                                            value: el,
                                            updateSettings
                                          })
                                        }
                                        value={interestedIn}
                                        placeholder={"Gender(s):"}
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
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        );
                      }}
                    </Mutation>
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
        <SetLocationModal
          visible={this.state.locModalVisible}
          close={() => this.setLocModalVisible(false)}
          setLocation={this.setLocation}
          isBlackMember={this.props.isBlackMember}
        />
      </div>
    );
  }
}

export default SearchCriteria;
