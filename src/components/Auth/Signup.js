import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { CREATE_USER, FB_RESOLVE, LOGIN } from "../../queries";
import AccountKit from "react-facebook-account-kit";
import { withNamespaces } from "react-i18next";
import Message from "rc-message";
import { Formik, Field, Form } from "formik";
import InterestedInDropdown from "../common/InterestedInDropdown";
import GenderDropdown from "../common/GenderDropdown";
import BirthDatePicker from "./BirthDatePicker";
import Select from "../common/Select";

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

class Signup extends React.Component {
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
                Message.warn("Phone verification failed.");
                return;
              }
              this.setState({ phone: data.fbResolve });
              createUser()
                .then(async ({ data }) => {
                  if (data.createUser === null) {
                    Message.warn("Signup failed.");
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
                    await this.props.history.push("/editprofile/couple");
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

    const max = 1000;
    const rand = Math.floor(Math.random() * max);
    this.setState(
      {
        phone: rand.toString(),
        username: "TEST USER",
        email: rand.toString() + "@fjfj.com",
        dob: "12/12/1990",
        interestedIn: ["M"],
        gender: "M",
        isCouple: false,
        lang: "en"
      },
      createUser()
        .then(async ({ data }) => {
          if (data.createUser === null) {
            Message.warn("Signup failed.");
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
        })
    );
  };

  handleLangChange = value => {
    this.setState({ lang: value });
  };

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  //TODO:DELETE THIS
  handleLogin = login => {
    login()
      .then(async ({ data }) => {
        if (data.login === null) {
          Message.warn("User doesn't exist.");
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
    const { t } = this.props;

    let {
      csrf,
      code,
      phone,
      username,
      email,
      dob,
      interestedIn,
      lang,
      gender,
      isCouple
    } = this.state;

    return (
      <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
        {fbResolve => {
          return (
            <Mutation
              mutation={CREATE_USER}
              variables={{
                phone,
                username,
                email,
                dob,
                interestedIn,
                gender,
                isCouple,
                lang
              }}
            >
              {(createUser, { loading }) => {
                return (
                  <div className="register-form">
                    <div className="head">
                      Become a <b>Foxtail</b> Member
                    </div>
                    <Formik
                      initialValues={{
                        firstName: "",
                        lastName: "",
                        email: ""
                      }}
                      onSubmit={values => {
                        setTimeout(() => {
                          alert(JSON.stringify(values, null, 2));
                        }, 500);
                      }}
                      render={() => (
                        <Form>
                          <div className="form-content">
                            <div className="input username">
                              <Field
                                name="username"
                                placeholder="Username"
                                type="text"
                              />
                            </div>
                            <div className="input email">
                              <Field
                                name="email"
                                placeholder="E-mail address"
                                type="email"
                              />
                            </div>
                            <BirthDatePicker
                              onDayChange={date => this.setState({ dob: date })}
                            />

                            <Select
                              label="Interested In:"
                              onChange={e => console.log(e)}
                              options={[
                                { label: "Female", value: "female" },
                                { label: "Male", value: "male" },
                                { label: "Transgender", value: "trans" },
                                { label: "Cuple", value: "couple" }
                              ]}
                            />

                            <Select
                              className="test"
                              onChange={e => console.log(e)}
                              multiple
                              label="Gender Select:"
                              defaultOptionValues={["m", "c"]}
                              options={[
                                { label: "Female", value: "f" },
                                { label: "Male", value: "m" },
                                { label: "Couple", value: "c" }
                              ]}
                            />

                            <div className="couple-choose">
                              <div className="select-checkbox">
                                <input type="checkbox" id="cbox" />
                                <label htmlFor="cbox">
                                  <span />
                                  <b>Are you couple?</b>
                                </label>
                              </div>
                            </div>
                            <div className="submit">
                              <span className="btn">Get Started</span>
                            </div>

                            <div className="terms">
                              By clicking “Get Started“ you agree with our
                              <span>Terms & Privacy</span> <br />
                              <span
                                onClick={() => this.testCreateUser(createUser)}
                              >
                                Test Create
                              </span>
                              <br />
                              <br />
                              Test Users:
                              <Mutation mutation={LOGIN} variables={{ phone }}>
                                {(login, { loading, error }) => {
                                  return (
                                    <div>
                                      <span
                                        onClick={() => {
                                          this.setState({ phone: "1" }, () => {
                                            this.handleLogin(login);
                                          });
                                        }}
                                      >
                                        1
                                      </span>{" "}
                                      <span
                                        onClick={() => {
                                          this.setState({ phone: "2" }, () => {
                                            this.handleLogin(login);
                                          });
                                        }}
                                      >
                                        2
                                      </span>{" "}
                                      <span
                                        href={null}
                                        onClick={() => {
                                          this.setState({ phone: "3" }, () => {
                                            this.handleLogin(login);
                                          });
                                        }}
                                      >
                                        3
                                      </span>{" "}
                                      <span
                                        onClick={() => {
                                          this.setState({ phone: "4" });
                                          this.handleLogin(login);
                                        }}
                                      >
                                        4
                                      </span>
                                      <span
                                        onClick={() => {
                                          this.setState({ phone: "5" }, () => {
                                            this.handleLogin(login);
                                          });
                                        }}
                                      >
                                        5
                                      </span>
                                    </div>
                                  );
                                }}
                              </Mutation>
                            </div>
                          </div>
                        </Form>
                      )}
                    />
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

export default withNamespaces()(withRouter(Signup));
