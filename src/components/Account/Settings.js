import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Mutation, Query } from "react-apollo";
import { UPDATE_SETTINGS, GET_SETTINGS } from "../../queries";
import Spinner from "../common/Spinner";
import withAuth from "../withAuth";
import CoupleModal from "../common/CoupleModal";
import BlackMemberModal from "../common/BlackMemberModal";
import DeactivateAcctBtn from "../common/DeactivateAcctBtn";
import BlackStatus from "../common/BlackStatus";

import { Form, Input, Switch, Button, Icon, Tooltip, message } from "antd";

const FormItem = Form.Item;

class SettingsForm extends Component {
  state = {
    coupleModalVisible: false,
    blkMemberModalVisible: false
  };
  componentWillUnmount() {
    //TODO: Get this working
    console.log("Check here if settigns are different ask them to save");
  }
  handleSubmit = (e, updateSettings) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      updateSettings()
        .then(({ data }) => {
          if (data.updateSettings) {
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

  handleChangeSelect = value => {
    this.props.form.setFieldsValue({ interestedIn: value });
  };

  onSwitch = (value, name) => {
    this.props.form.setFieldsValue({ [name]: value });
  };

  setCoupleModalVisible = coupleModalVisible => {
    this.setState({ coupleModalVisible });
  };

  setBlkMemberModalVisible = (e, blkMemberModalVisible) => {
    e.preventDefault();
    this.setState({ blkMemberModalVisible });
  };

  setPartnerID = id => {
    this.props.form.setFieldsValue({ couplePartner: id });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { session } = this.props;
    const { coupleModalVisible, blkMemberModalVisible } = this.state;

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
          }

          const {
            locationLock,
            visible,
            newMsgNotify,
            emailNotify,
            showOnline,
            likedOnly,
            vibrateNotify,
            couplePartner
          } = settings;
          return (
            <Mutation
              mutation={UPDATE_SETTINGS}
              variables={{
                locationLock,
                visible,
                newMsgNotify,
                emailNotify,
                showOnline,
                likedOnly,
                vibrateNotify
              }}
            >
              {(updateSettings, { loading }) => {
                return (
                  <Fragment>
                    <Form onSubmit={e => this.handleSubmit(e, updateSettings)}>
                      <h3 className="formItemLayout">Preferences</h3>
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
                        {getFieldDecorator("locationLock", {
                          initialValue: settings.locationLock || ""
                        })(
                          <Input
                            style={{ width: "50%" }}
                            disabled={!session.currentuser.blackMember.active}
                          />
                        )}
                      </FormItem>
                      <div>
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
                                disabled={
                                  !session.currentuser.blackMember.active
                                }
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
                                disabled={
                                  !session.currentuser.blackMember.active
                                }
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
                      </div>

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
