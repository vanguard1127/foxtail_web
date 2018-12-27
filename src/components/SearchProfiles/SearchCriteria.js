import React, { Component, Fragment } from "react";
import { Mutation, Query } from "react-apollo";
import { UPDATE_SETTINGS, GET_SETTINGS, REMOVE_LOCLOCK } from "../../queries";
import { sexOptions } from "../../docs/data";
import Spinner from "../common/Spinner";
import AddressSearch from "../common/AddressSearch";
import SetLocationModal from "../common/SetLocationModal";
import {
  Form,
  Switch,
  Slider,
  Button,
  Icon,
  Tooltip,
  Select,
  Collapse,
  message
} from "antd";

const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;
const CURRENT_LOC_LABEL = "My Location";

class SearchCriteria extends Component {
  state = {
    long: this.props.queryParams.long,
    lat: this.props.queryParams.lat,
    limit: this.props.queryParams.limit,
    locModalVisible: false,
    location: null
  };

  setLocModalVisible = visible => {
    this.setState({ locModalVisible: visible });
  };
  setLocation = async pos => {
    var crd = pos.coords;
    var location = pos.location ? pos.location : CURRENT_LOC_LABEL;

    const { long, lat } = this.state;
    if (long !== crd.longitude && lat !== crd.latitude) {
      this.setState({ long: crd.longitude, lat: crd.latitude });
      this.props.form.setFieldsValue({ location });
    }
  };

  handleSubmit = (e, updateSettings) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      updateSettings()
        .then(async ({ data }) => {
          const { lat, long } = this.state;
          //if null get location
          this.props.setQueryLoc({ lat, long });
          this.props.client.resetStore();
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
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

  handleChangeSelect = value => {
    this.props.form.setFieldsValue({ interestedIn: value });
  };

  setLocationValues = ({ lat, long, address }) => {
    console.log(lat, long, address);
    this.setState({ lat, long, location: address });
  };

  render() {
    const { lat, long } = this.state;
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

            let settings;
            // if (this.props.form.getFieldsValue().distance) {
            //   settings = this.props.form.getFieldsValue();
            // } else {
            settings = data.getSettings;
            //}

            const {
              distance,
              distanceMetric,
              ageRange,
              interestedIn,
              location
            } = settings;

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
                          <section class="meet-filter">
                            <div class="container">
                              <div class="col-md-12">
                                <div class="row">
                                  <div class="col-md-6">
                                    <AddressSearch
                                      style={{ width: "100%" }}
                                      setLocationValues={this.setLocationValues}
                                      address={location}
                                      type={"(cities)"}
                                    />
                                    {/* <select
                                        class="js-example-basic-single search"
                                        name="located[]"
                                      >
                                        <option>United States</option>
                                        <option>France</option>
                                        <option>Turkey</option>
                                      </select>
                                      <label>Location:</label>
                                    </div> */}
                                  </div>
                                  <div class="col-md-6">
                                    <div class="dropdown">
                                      <select
                                        class="js-example-basic-multiple"
                                        name="genders[]"
                                        multiple="multiple"
                                      >
                                        <option>Male</option>
                                        <option selected>Female</option>
                                        <option selected>Couple</option>
                                      </select>
                                      <label>Gender(s):</label>
                                    </div>
                                  </div>
                                  <div class="col-md-6">
                                    <div class="item">
                                      <div class="range-head">Distance:</div>
                                      <div class="range-con">
                                        <div
                                          id="pmd-slider-range-tooltip-distance"
                                          class="pmd-range-tooltip"
                                        />
                                      </div>
                                      <div class="limit">
                                        <span>1 mil</span>
                                        <span>100+ mil</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-md-6">
                                    <div class="item">
                                      <div class="range-head">Age:</div>
                                      <div class="range-con">
                                        <div
                                          id="pmd-slider-range-tooltip-age"
                                          class="pmd-range-tooltip"
                                        />
                                      </div>
                                      <div class="limit">
                                        <span>18 years</span>
                                        <span>80+ years</span>
                                      </div>
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
