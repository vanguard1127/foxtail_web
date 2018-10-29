import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { CREATE_USER, FB_RESOLVE } from "../../queries";
import AccountKit from "react-facebook-account-kit";
import {
  Button,
  DatePicker,
  Input,
  Checkbox,
  Icon,
  Form,
  Select,
  Radio
} from "antd";
import { sexOptions } from "../../docs/data";
// import Moustache from "../../images/moustache.svg"; // path to your '*.svg' file.
// import LipsSvg from "../../images/lips.svg"; // path to your '*.svg' file.

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

const FormItem = Form.Item;

const initialState = {
  username: "",
  email: "",
  phone: "",
  dob: "",
  interestedIn: [],
  gender: "",
  iscouple: false,
  csrf: "",
  code: ""
};

class SignupForm extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.props.form.setFieldsValue({ [name]: value });
  };

  onChangeDate = (date, dateString) => {
    this.setState({ dob: dateString });
  };

  handleChangeSelect = value => {
    this.setState({ interestedIn: value });
  };

  handleFBReturn = ({ state, code }, fbResolve, createUser) => {
    this.setState(
      {
        csrf: state,
        code
      },
      () => {
        fbResolve().then(({ data }) => {
          this.setState({ phone: data.fbResolve });
          createUser().then(async ({ data }) => {
            localStorage.setItem("token", data.createUser.token);
            //    await this.props.refetch();
            this.clearState();
            this.props.history.push("/editprofile");
          });
        });
      }
    );
  };

  validateForm = () => {
    const { username, email, dob, interestedIn, gender } = this.state;

    const isInvalid = !username || !email || !dob || !interestedIn || !gender;

    return isInvalid;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    };

    const {
      username,
      email,
      dob,
      interestedIn,
      gender
    } = this.props.form.getFieldsValue();

    const { csrf, code, phone } = this.state;

    return (
      <div className="centerColumn fullHeight">
        <h2 className="App">Become a Foxtail Member</h2>{" "}
        <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
          {(fbResolve, { data, loading, error }) => {
            return (
              <Mutation
                mutation={CREATE_USER}
                variables={{
                  username,
                  email,
                  phone,
                  dob,
                  interestedIn,
                  gender
                }}
              >
                {(createUser, { data, loading, error }) => {
                  return (
                    <div>
                      <Form
                        style={{
                          ...this.props.formStyle,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around"
                        }}
                      >
                        <FormItem {...formItemLayout} label={" "} colon={false}>
                          {getFieldDecorator("username")(
                            <Input
                              placeholder="Username"
                              name="username"
                              onChange={this.handleChange}
                            />
                          )}
                        </FormItem>
                        <FormItem {...formItemLayout} label={" "} colon={false}>
                          {getFieldDecorator("email")(
                            <Input
                              placeholder="Email"
                              name="email"
                              onChange={this.handleChange}
                            />
                          )}
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          label="Birthday"
                          colon={false}
                        >
                          {getFieldDecorator("dob", {
                            initialValue: dob
                              ? moment({ dob })
                              : moment(
                                  new Date().setFullYear(
                                    new Date().getFullYear() - 18
                                  )
                                )
                          })(<DatePicker onChange={this.onChangeDate} />)}
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          label="Gender"
                          colon={false}
                        >
                          {getFieldDecorator("gender")(
                            <RadioGroup
                              onClick={this.handleChange}
                              selected={gender}
                            >
                              <RadioButton size="large" value="M">
                                Male
                                {/* <Icon component={Moustache} /> */}
                              </RadioButton>
                              <RadioButton size="large" value="F">
                                Female
                                {/* <Icon component={LipsSvg} /> */}
                              </RadioButton>
                              <RadioButton size="large" value="T">
                                Trans
                                {/* <Icon component={MoustacheSvg} />
                              <Icon component={LipsSvg} /> */}
                              </RadioButton>
                            </RadioGroup>
                          )}
                        </FormItem>
                        <FormItem {...formItemLayout} label={" "} colon={false}>
                          {getFieldDecorator("interestedIn")(
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
                        <FormItem {...formItemLayout} label={" "} colon={false}>
                          {getFieldDecorator("iscouple")(
                            <Checkbox
                              name="iscouple"
                              onChange={this.handleChange}
                            >
                              Are you a couple?
                            </Checkbox>
                          )}
                        </FormItem>
                      </Form>
                      <AccountKit
                        appId="172075056973555" // Update this!
                        version="v1.1" // Version must be in form v{major}.{minor}
                        onResponse={resp => {
                          this.handleFBReturn(resp, fbResolve, createUser);
                        }}
                        csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
                        countryCode={"+1"} // eg. +60
                        phoneNumber={"1111116711"} // eg. 12345678
                        emailAddress={"trses@dofo.com"} // eg. me@site.com
                      >
                        {p => (
                          <div>
                            <Button
                              size="large"
                              disabled={loading || this.validateForm()}
                              {...p}
                              htmlType="submit"
                            >
                              {" "}
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                              Verify your phone number to begin
                            </Button>

                            <small>
                              <br />
                              Phone number will be used for login and not
                              marketing.
                            </small>
                          </div>
                        )}
                      </AccountKit>
                    </div>
                  );
                }}
              </Mutation>
            );
          }}
        </Mutation>
      </div>
    );
  }
}
const Signup = Form.create()(SignupForm);
export default withRouter(Signup);
