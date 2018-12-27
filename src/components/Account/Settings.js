import React, { Component, Fragment } from "react";
import { withRouter, Prompt } from "react-router-dom";
import { Mutation, Query } from "react-apollo";
import { UPDATE_SETTINGS, GET_SETTINGS } from "../../queries";
import Spinner from "../common/Spinner";
import { sexOptions } from "../../docs/data";
import withAuth from "../withAuth";
import CoupleModal from "../common/CoupleModal";
import BlackMemberModal from "../common/BlackMemberModal";
import DeactivateAcctBtn from "../common/DeactivateAcctBtn";
import BlackStatus from "../common/BlackStatus";
import LangDropdown from "../common/LangDropdown";

import {
  Form,
  Input,
  Switch,
  Slider,
  Button,
  Icon,
  Tooltip,
  Radio,
  Select,
  message
} from "antd";

const milesToKilometers = miles => miles / 0.621371;
const kilometersToMiles = kilometers => kilometers * 0.621371;
const Option = Select.Option;
const FormItem = Form.Item;

class SettingsForm extends Component {
  state = {
    coupleModalVisible: false,
    blkMemberModalVisible: false,
    isChanged: false,
    lang: "en",
    newDistanceMetric: null
  };

  handleSubmit = (e, updateSettings) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      updateSettings()
        .then(({ data }) => {
          if (data.updateSettings) {
            this.setState({ isChanged: false });
            message.success("Settings have been saved");
          } else {
            message.error("Error saving settings. Please contact support.");
          }
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

  //tried it the clever way using the form but it doesnt save the value properly
  handleLangChange = value => {
    this.setState({ lang: value });
    this.props.form.setFieldsValue({ lang: value });
    this.handleFormChange();
  };

  handleChangeSelect = value => {
    this.props.form.setFieldsValue({ interestedIn: value });
    this.handleFormChange();
  };

  onSwitch = (value, name) => {
    this.props.form.setFieldsValue({ [name]: value });
    this.handleFormChange();
  };

  setCoupleModalVisible = coupleModalVisible => {
    this.setState({ coupleModalVisible });
  };

  setBlkMemberModalVisible = (e, blkMemberModalVisible) => {
    e.preventDefault();
    this.setState({ blkMemberModalVisible });
    this.handleFormChange();
  };

  setPartnerID = id => {
    this.props.form.setFieldsValue({ couplePartner: id });
  };

  handleFormChange = () => {
    this.setState({ isChanged: true });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { session } = this.props;
    const { coupleModalVisible, blkMemberModalVisible, isChanged } = this.state;
    let { lang } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
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

          if (Object.keys(this.props.form.getFieldsValue()).length !== 0) {
            settings = this.props.form.getFieldsValue();
          } else {
            settings = data.getSettings;
            lang = data.getSettings.lang;
          }
          const initialDistanceMetric = data.getSettings.distanceMetric;
          const {
            location,
            visible,
            newMsgNotify,
            emailNotify,
            showOnline,
            likedOnly,
            vibrateNotify,
            couplePartner,
            distance,
            distanceMetric,
            ageRange,
            interestedIn
          } = settings;

          console.log(
            distance,
            settings.distanceMetric,
            data.getSettings.distanceMetric
          );
          const convertFunction =
            "mi" === distanceMetric ? kilometersToMiles : milesToKilometers;
          // The input uses original metric
          // But displays and sends the selected metric
          let convertedDistance = distance;
          if (distanceMetric !== initialDistanceMetric) {
            convertedDistance = Math.floor(convertFunction(distance));
          }
          console.log("d1", distance, "d2", convertedDistance, distanceMetric);
          return (
            <Mutation
              mutation={UPDATE_SETTINGS}
              variables={{
                distance: convertedDistance,
                distanceMetric,
                ageRange,
                interestedIn,
                location,
                visible,
                newMsgNotify,
                lang,
                emailNotify,
                showOnline,
                likedOnly,
                vibrateNotify
              }}
            >
              {(updateSettings, { loading }) => {
                // The input always uses the first metric it was given
                // And sends a transformed metric if the user changed it
                const initialDistanceSliderMax =
                  initialDistanceMetric === "mi"
                    ? 100
                    : Math.floor(milesToKilometers(100));

                const distanceSliderMax =
                  distanceMetric === "mi"
                    ? 100
                    : Math.floor(milesToKilometers(100));
                return (
                  <Fragment>
                    <LangDropdown
                      onChange={this.handleLangChange}
                      value={lang}
                    />
                    <Form onSubmit={e => this.handleSubmit(e, updateSettings)}>
                      <h3 className="formItemLayout">Preferences</h3>

                      <FormItem {...formItemLayout} label="Distance">
                        {getFieldDecorator("distance", {
                          initialValue: settings.distance
                        })(
                          // Minimum of 1 miles/kilometers
                          <Slider
                            min={1}
                            max={initialDistanceSliderMax}
                            tipFormatter={val => {
                              if (distanceMetric !== initialDistanceMetric) {
                                return (
                                  Math.floor(convertFunction(val)) +
                                  distanceMetric
                                );
                              }
                              return val + distanceMetric;
                            }}
                            marks={{
                              0: `<1 ${distanceMetric.toUpperCase()}`,
                              [initialDistanceSliderMax]: `${distanceSliderMax}+ ${distanceMetric.toUpperCase()}`
                            }}
                          />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label={" "} colon={false}>
                        {getFieldDecorator("distanceMetric", {
                          initialValue: settings.distanceMetric
                        })(
                          <Radio.Group>
                            <Radio value="mi">miles</Radio>
                            <Radio value="km">Kilometers</Radio>
                          </Radio.Group>
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
                      <FormItem {...formItemLayout} label="Interested In">
                        {getFieldDecorator("interestedIn", {
                          rules: [
                            {
                              required: true,
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
                              <Option key={option.value}>{option.label}</Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="Couple Partner:">
                        {getFieldDecorator("couplePartner", {
                          initialValue: couplePartner
                            ? couplePartner
                            : "Add Partner"
                        })(
                          <a
                            href={null}
                            onClick={() => this.setCoupleModalVisible(true)}
                          >
                            {this.props.form.getFieldValue("couplePartner")}
                          </a>
                        )}
                      </FormItem>
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
                        {getFieldDecorator("location", {
                          initialValue: settings.location || ""
                        })(
                          <Input
                            style={{ width: "50%" }}
                            disabled={!session.currentuser.blackMember.active}
                          />
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label={" "} colon={false}>
                        {getFieldDecorator("visible", {
                          initialValue: settings.visible
                        })(
                          <div>
                            {" "}
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              onChange={e => this.onSwitch(e, "visible")}
                              checked={settings.visible}
                            />
                            <span style={{ marginLeft: "10px" }}>
                              Show Me to Members
                            </span>
                          </div>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label={" "} colon={false}>
                        {getFieldDecorator("newMsgNotify", {
                          initialValue: settings.newMsgNotify
                        })(
                          <div>
                            {" "}
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              onChange={e => this.onSwitch(e, "newMsgNotify")}
                              checked={settings.newMsgNotify}
                            />
                            <span style={{ marginLeft: "10px" }}>
                              Recieve Notifications
                            </span>
                          </div>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label={" "} colon={false}>
                        {getFieldDecorator("emailNotify", {
                          initialValue: settings.emailNotify
                        })(
                          <div>
                            {" "}
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              onChange={e => this.onSwitch(e, "emailNotify")}
                              checked={settings.emailNotify}
                            />
                            <span style={{ marginLeft: "10px" }}>
                              Email Notificatons
                            </span>
                          </div>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label={" "} colon={false}>
                        {getFieldDecorator("showOnline", {
                          initialValue: settings.showOnline
                        })(
                          <div>
                            {" "}
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              defaultChecked={false}
                              disabled={!session.currentuser.blackMember.active}
                              onChange={e => this.onSwitch(e, "showOnline")}
                              checked={settings.showOnline}
                            />
                            <span style={{ marginLeft: "10px" }}>
                              Show Online Status&nbsp;
                              <Tooltip title="Black Members Only: No one will know when you're online">
                                <Icon type="question-circle-o" />
                              </Tooltip>
                            </span>
                          </div>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label={" "} colon={false}>
                        {getFieldDecorator("likedOnly", {
                          initialValue: settings.likedOnly
                        })(
                          <div>
                            {" "}
                            <Switch
                              checkedChildren={<Icon type="check" />}
                              unCheckedChildren={<Icon type="close" />}
                              defaultChecked={false}
                              disabled={!session.currentuser.blackMember.active}
                              onChange={e => this.onSwitch(e, "likedOnly")}
                              checked={settings.likedOnly}
                            />
                            <span style={{ marginLeft: "10px" }}>
                              Show Me Only To Members I&#39;ve Liked&nbsp;
                              <Tooltip title="Black Members Only: You can see them, You choose who sees you.">
                                <Icon type="question-circle-o" />
                              </Tooltip>
                            </span>
                          </div>
                        )}
                      </FormItem>
                      <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                        <BlackStatus
                          blkMemberInfo={session.currentuser.blackMember}
                          visible={e => this.setBlkMemberModalVisible(e, true)}
                          ccLast4={session.currentuser.ccLast4}
                          refetchUser={this.props.refetch}
                        />
                      </FormItem>

                      <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          disabled={loading}
                        >
                          Save
                        </Button>
                      </FormItem>

                      <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                        <DeactivateAcctBtn history={this.props.history} />
                      </FormItem>
                    </Form>
                    <CoupleModal
                      visible={coupleModalVisible}
                      close={() => this.setCoupleModalVisible(false)}
                      setPartnerID={this.setPartnerID}
                      username={
                        this.props.form.getFieldValue("couplePartner") !==
                        "Add Partner"
                          ? this.props.form.getFieldValue("couplePartner")
                          : null
                      }
                    />
                    {session.currentuser.blackMember && (
                      <BlackMemberModal
                        visible={blkMemberModalVisible}
                        close={e => this.setBlkMemberModalVisible(e, false)}
                        userID={session.currentuser.userID}
                        refetchUser={this.props.refetch}
                      />
                    )}
                    <Prompt
                      when={isChanged}
                      message={location =>
                        `Are you sure you want to leave without saving your changes?`
                      }
                    />
                  </Fragment>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

const Settings = Form.create()(SettingsForm);

export default withAuth(session => session && session.currentuser)(
  withRouter(Settings)
);
