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
  Radio,
  message
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
  isCouple: false,
  csrf: "",
  code: ""
};

class SignupForm extends React.Component {
  state = { ...initialState };

  componentDidMount() {
    // if (localStorage.getItem("token") !== null) {
    //   //TODO: Check somehow if user active...Possibly use session.
    //   this.props.history.push("/members");
    // }
  }

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
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.setState(
        {
          ...values,
          csrf: state,
          code
        },
        () => {
          fbResolve()
            .then(({ data }) => {
              const { isCouple } = this.state;
              if (data.fbResolve === null) {
                message.warn("Phone verification failed.");
                return;
              }
              this.setState({ phone: data.fbResolve });
              createUser()
                .then(async ({ data }) => {
                  if (data.createUser === null) {
                    message.warn("Signup failed.");
                    return;
                  }
                  localStorage.setItem(
                    "token",
                    data.createUser.find(token => token.access === "auth").token
                  );
                  localStorage.setItem(
                    "refreshToken",
                    data.createUser.find(token => token.access === "refresh")
                      .token
                  );

                  if (isCouple) {
                    this.clearState();
                    await this.props.history.push("/editprofile/" + "couple");
                  } else {
                    this.clearState();
                    await this.props.history.push("/editprofile");
                  }
                })
                .catch(res => {
                  const errors = res.graphQLErrors.map(error => {
                    return error.message;
                  });
                  //TODO: send errors to analytics from here
                  this.setState({ errors });
                });
            })
            .catch(res => {
              const errors = res.graphQLErrors.map(error => {
                return error.message;
              });
              //TODO: send errors to analytics from here
              this.setState({ errors });
            });
        }
      );
    });
  };

  validateForm = () => {
    const {
      username,
      email,
      dob,
      interestedIn,
      gender
    } = this.props.form.getFieldsValue();
    const isLengthZero = interestedIn ? interestedIn.length === 0 : true;

    const isInvalid =
      !username || !email || !dob || !interestedIn || !gender || isLengthZero;

    return isInvalid;
  };

  disabledDate = current => {
    // Can not select days before 18 years
    return (
      current &&
      current >
        moment()
          .endOf("day")
          .subtract(18, "years")
    );
  };

  testCreateUser = createUser => {
    const { isCouple } = this.state;
    createUser()
      .then(async ({ data }) => {
        if (data.createUser === null) {
          message.warn("Signup failed.");
          return;
        }
        localStorage.setItem(
          "token",
          data.createUser.find(token => token.access === "auth").token
        );
        localStorage.setItem(
          "refreshToken",
          data.createUser.find(token => token.access === "refresh").token
        );

        if (isCouple) {
          this.clearState();
          window.location.href = '/editprofile/couple';
          //await this.props.history.push("/editprofile/" + "couple");
        } else {
          this.clearState();
          window.location.href = '/editprofile';
          //await this.props.history.push("/editprofile");
        }
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });
        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    };

    const {
      csrf,
      code,
      phone,
      username,
      email,
      dob,
      interestedIn,
      gender
    } = this.state;

    return (
      <div className="centerColumn fullHeight">
        <h2 className="App">Become a Foxtail Member</h2>{" "}
        <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
          {fbResolve => {
            const max = 1000;
            const rand = Math.floor(Math.random() * max);
            return (
              <Mutation
                mutation={CREATE_USER}
                variables={{
                  phone: rand.toString(),
                  username: "TEST USER",
                  email: rand.toString() + "@fjfj.com",
                  dob: "12/12/1990",
                  interestedIn: ["M"],
                  gender: "M",
                  isCouple: false
                }}
              >
                {(createUser, { loading }) => {
                  return (
                    <div>
                      <Form
                        style={{
                          ...this.props.formStyle,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around"
                        }}
                        hideRequiredMark={true}
                      >
                        <FormItem {...formItemLayout} label={" "} colon={false}>
                          {getFieldDecorator("username", {
                            rules: [
                              {
                                required: true,
                                message: "Please select a user name!"
                              }
                            ]
                          })(
                            <Input
                              placeholder="Username"
                              name="username"
                              onChange={this.handleChange}
                            />
                          )}
                        </FormItem>
                        <FormItem {...formItemLayout} label={" "} colon={false}>
                          {getFieldDecorator("email", {
                            rules: [
                              {
                                required: true,
                                type: "email",
                                message: "Please enter a valid email"
                              }
                            ]
                          })(
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
                            rules: [
                              {
                                required: true,
                                message: "Please enter your birthday"
                              }
                            ],
                            initialValue: moment()
                              .endOf("day")
                              .subtract(18, "years")
                          })(
                            <DatePicker
                              disabledDate={this.disabledDate}
                              onChange={this.onChangeDate}
                              showTime={false}
                              showToday={false}
                              format="YYYY-MM-DD"
                            />
                          )}
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          label="Gender"
                          colon={false}
                        >
                          {getFieldDecorator("gender", {
                            rules: [
                              {
                                required: true,
                                type: "enum",
                                enum: ["M", "F", "T"],
                                message: "Please select your gender"
                              }
                            ]
                          })(
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
                          {getFieldDecorator("isCouple", {
                            initialValue: false
                          })(
                            <Checkbox
                              name="isCouple"
                              onChange={this.handleChange}
                            >
                              Are you a couple?
                            </Checkbox>
                          )}
                        </FormItem>
                      </Form>
                      <AccountKit
                        disabled={loading || this.validateForm()}
                        appId="172075056973555" // Update this!
                        version="v1.1" // Version must be in form v{major}.{minor}
                        onResponse={resp => {
                          this.handleFBReturn(resp, fbResolve, createUser);
                        }}
                        csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
                        countryCode={"+1"} // eg. +60
                        phoneNumber={""} // eg. 12345678
                        emailAddress={""} // eg. me@site.com
                      >
                        {p => (
                          <div>
                            <Button size="large" {...p} htmlType="submit">
                              {" "}
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                              Verify your phone number to begin
                            </Button>
                            <Button
                              onClick={() => this.testCreateUser(createUser)}
                            >
                              Test Create
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
