import React, { Component, Fragment } from "react";
import { Mutation, Query } from "react-apollo";
import { UPDATE_SETTINGS, GET_SETTINGS, REMOVE_LOCLOCK } from "../../queries";
import { sexOptions } from "../../docs/data";
import Spinner from "../common/Spinner";
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
                          <Fragment>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column"
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-around"
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flex: "1"
                                  }}
                                >
                                  <a
                                    href={null}
                                    onClick={() =>
                                      this.setLocModalVisible(true)
                                    }
                                    disabled={!this.props.isBlackMember}
                                  >
                                    {CURRENT_LOC_LABEL}
                                  </a>
                                  {location !== CURRENT_LOC_LABEL && (
                                    <Icon
                                      type="close"
                                      onClick={e =>
                                        this.handleRemoveLocLock(
                                          e,
                                          removeLocation
                                        )
                                      }
                                    />
                                  )}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flex: "1"
                                  }}
                                >
                                  <Select
                                    mode="multiple"
                                    style={{ width: "100%" }}
                                    placeholder="Interested In"
                                    onChange={this.handleChangeSelect}
                                    defaultValue={interestedIn}
                                  >
                                    {sexOptions.map(option => (
                                      <Option key={option.value}>
                                        {option.label}
                                      </Option>
                                    ))}
                                  </Select>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-around"
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flex: "1"
                                  }}
                                >
                                  {" "}
                                  <Switch
                                    checkedChildren="mi"
                                    unCheckedChildren="km"
                                    defaultChecked
                                  />
                                  <Slider
                                    min={0}
                                    max={100}
                                    defaultValue={distance}
                                    marks={{
                                      0: "<1 " + distanceMetric,
                                      100: "100+"
                                    }}
                                    style={{
                                      display: "flex",
                                      flex: "1"
                                    }}
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flex: "1"
                                  }}
                                >
                                  {" "}
                                  <Slider
                                    range
                                    min={18}
                                    max={80}
                                    marks={{ 18: "18 years", 80: "80+" }}
                                    defaultValue={ageRange}
                                    style={{
                                      display: "flex",
                                      flex: "1"
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Fragment>
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
