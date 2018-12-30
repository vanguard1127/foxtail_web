import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { CREATE_USER, FB_RESOLVE, LOGIN } from "../../queries";
import AccountKit from "react-facebook-account-kit";
import { withNamespaces } from "react-i18next";
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
// import Moustache from "../../images/moustache.svg"; // path to your '*.svg' file.
// import LipsSvg from "../../images/lips.svg"; // path to your '*.svg' file.
import InterestedInDropdown from "../common/InterestedInDropdown";
import GenderDropdown from "../common/GenderDropdown";

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
  code: "",
  lang: "en"
};

class SignupForm extends React.Component {
  state = { ...initialState };

  componentDidMount() {
    if (localStorage.getItem("token") !== null) {
      //TODO: Check somehow if user active...Possibly use session.
      this.props.history.push("/members");
    }
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
          window.location.href = "/editprofile/couple";
          //await this.props.history.push("/editprofile/" + "couple");
        } else {
          this.clearState();
          window.location.href = "/editprofile";
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

  handleLangChange = value => {
    this.setState({ lang: value });
  };

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  handleLogin = login => {
    login()
      .then(async ({ data }) => {
        if (data.login === null) {
          message.warn("User doesn't exist.");
          return;
        }

        localStorage.setItem(
          "token",
          data.login.find(token => token.access === "auth").token
        );
        localStorage.setItem(
          "refreshToken",
          data.login.find(token => token.access === "refresh").token
        );
        // await this.props.refetch();
        this.props.history.push("/members");
      })
      .catch(res => {
        console.log("ERR", res);
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { t } = this.props;
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
      lang,
      gender
    } = this.state;

    return (
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
                isCouple: false,
                lang: "en"
              }}
            >
              {(createUser, { loading }) => {
                return (
                  <div className="register-form">
                    <div className="head">
                      Become a <b>Foxtail</b> Member
                    </div>
                    <form>
                      <div className="form-content">
                        <div className="input username">
                          <input type="text" placeholder="Username" />
                        </div>
                        <div className="input email">
                          <input type="text" placeholder="E-mail address" />
                        </div>
                        <div className="input birthday">
                          <input id="datepicker" placeholder="Birthday" />
                        </div>

                        <GenderDropdown
                          setValue={el =>
                            this.setValue({
                              name: "interestedIn",
                              value: el
                            })
                          }
                          value={interestedIn}
                          placeholder={"Gender:"}
                        />

                        <InterestedInDropdown
                          setValue={el =>
                            this.setValue({
                              name: "interestedIn",
                              value: el
                            })
                          }
                          value={interestedIn}
                          placeholder={"Interested In:"}
                        />
                        <div className="couple-choose">
                          <div className="select-checkbox">
                            <input type="checkbox" id="cbox" />
                            <label for="cbox">
                              <span />
                              <b>Are you couple?</b>
                            </label>
                          </div>
                        </div>
                        <div className="submit">
                          <a className="btn" href="#">
                            Get Started
                          </a>
                        </div>
                        <div className="terms">
                          By clicking “Get Started“ you agree with our
                          <a href="#">Terms & Privacy</a> <br />
                          <a
                            href={null}
                            onClick={() => this.testCreateUser(createUser)}
                          >
                            Test Create
                          </a>
                          <br />
                          <br />
                          Test Users:
                          <Mutation mutation={LOGIN} variables={{ phone }}>
                            {(login, { loading, error }) => {
                              return (
                                <div>
                                  <a
                                    href={null}
                                    onClick={() => {
                                      this.setState({ phone: "1" }, () => {
                                        this.handleLogin(login);
                                      });
                                    }}
                                  >
                                    1
                                  </a>{" "}
                                  <a
                                    href={null}
                                    onClick={() => {
                                      this.setState({ phone: "2" }, () => {
                                        this.handleLogin(login);
                                      });
                                    }}
                                  >
                                    2
                                  </a>{" "}
                                  <a
                                    href={null}
                                    onClick={() => {
                                      this.setState({ phone: "3" }, () => {
                                        this.handleLogin(login);
                                      });
                                    }}
                                  >
                                    3
                                  </a>{" "}
                                  <a
                                    href={null}
                                    onClick={() => {
                                      this.setState({ phone: "4" });
                                      this.handleLogin(login);
                                    }}
                                  >
                                    4
                                  </a>
                                  <a
                                    href={null}
                                    onClick={() => {
                                      this.setState({ phone: "5" }, () => {
                                        this.handleLogin(login);
                                      });
                                    }}
                                  >
                                    5
                                  </a>
                                </div>
                              );
                            }}
                          </Mutation>
                        </div>
                      </div>
                    </form>
                  </div>
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}
const Signup = Form.create()(SignupForm);
export default withNamespaces()(withRouter(Signup));
