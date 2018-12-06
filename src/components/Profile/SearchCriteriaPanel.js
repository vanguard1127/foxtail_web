import React, { Component, Fragment } from "react";
import { Mutation, Query } from "react-apollo";
import { UPDATE_SETTINGS, GET_SETTINGS } from "../../queries";
import { sexOptions } from "../../docs/data";
import Spinner from "../common/Spinner";
import {
  Form,
  Input,
  Switch,
  Slider,
  Button,
  Icon,
  Tooltip,
  Select,
  Collapse
} from "antd";

const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;

class SearchCriteriaPanelForm extends Component {
  state = {
    long: this.props.queryParams.long,
    lat: this.props.queryParams.lat,
    limit: this.props.queryParams.limit
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

  deleteStoreQuery = name => {
    try {
      // Apollo 1.x
      // let rootQuery = this.props.client.store.getState().apollo.data.ROOT_QUERY;
      let rootQuery = this.props.client.store.cache.data.data.ROOT_QUERY;
      Object.keys(rootQuery)
        .filter(query => query.indexOf(name) === 0)
        .forEach(query => {
          delete rootQuery[query];
        });
    } catch (error) {
      console.error(`deleteStoreQuery: ${error}`);
    }
  };

  handleChangeSelect = value => {
    this.props.form.setFieldsValue({ interestedIn: value });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    // const { lat, long, limit } = this.state;
    return (
      <Collapse bordered={false} defaultActiveKey={["1"]}>
        <Panel header="Search Criteria" key="1" style={{ overflow: "hidden" }}>
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
              if (this.props.form.getFieldsValue().distance) {
                settings = this.props.form.getFieldsValue();
              } else {
                settings = data.getSettings;
              }

              const {
                distance,
                distanceMetric,
                ageRange,
                interestedIn,
                locationLock
              } = settings;

              return (
                <Mutation
                  mutation={UPDATE_SETTINGS}
                  variables={{
                    distance,
                    distanceMetric,
                    ageRange,
                    interestedIn,
                    locationLock
                  }}
                >
                  {(updateSettings, { loading }) => {
                    return (
                      <Fragment>
                        <Form
                          onSubmit={e => this.handleSubmit(e, updateSettings)}
                        >
                          <FormItem
                            {...formItemLayout}
                            label={
                              <span>
                                Set Location&nbsp;
                                <Tooltip title="Black Members Only: Set location to search from anywhere!">
                                  <Icon type="question-circle-o" />
                                </Tooltip>
                              </span>
                            }
                          >
                            {getFieldDecorator("locationLock", {
                              initialValue: settings.locationLock || ""
                            })(<Input style={{ width: "50%" }} disabled />)}
                          </FormItem>
                          <FormItem {...formItemLayout} label="Distance">
                            {getFieldDecorator("distance", {
                              initialValue: settings.distance
                            })(
                              <Slider
                                min={0}
                                max={100}
                                marks={{
                                  0: "<1 " + distanceMetric,
                                  100: "100+"
                                }}
                              />
                            )}
                          </FormItem>
                          <FormItem
                            {...formItemLayout}
                            label={" "}
                            colon={false}
                          >
                            {getFieldDecorator("distanceMetric", {
                              initialValue: settings.distanceMetric
                            })(
                              <Switch
                                checkedChildren="mi"
                                unCheckedChildren="km"
                                defaultChecked
                              />
                            )}
                          </FormItem>
                          <FormItem {...formItemLayout} label="Age">
                            {getFieldDecorator("ageRange", {
                              initialValue: settings.ageRange
                            })(
                              <Slider
                                range
                                min={18}
                                max={80}
                                marks={{ 18: "18 years", 80: "80+" }}
                              />
                            )}
                          </FormItem>
                          <FormItem {...formItemLayout} label="Gender(s)">
                            {getFieldDecorator("interestedIn", {
                              rules: [
                                {
                                  message:
                                    "Please select what type of members interest you!",
                                  type: "array"
                                }
                              ],
                              initialValue: settings.interestedIn
                            })(
                              <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="Interested In"
                                onChange={this.handleChangeSelect}
                              >
                                {sexOptions.map(option => (
                                  <Option key={option.value}>
                                    {option.label}
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </FormItem>

                          <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                            <Button
                              type="primary"
                              htmlType="submit"
                              disabled={loading}
                            >
                              Save + Search
                            </Button>
                          </FormItem>
                        </Form>
                      </Fragment>
                    );
                  }}
                </Mutation>
              );
            }}
          </Query>
        </Panel>
      </Collapse>
    );
  }
}

const SearchCriteriaPanel = Form.create()(SearchCriteriaPanelForm);
export default SearchCriteriaPanel;
