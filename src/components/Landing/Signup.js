<<<<<<< HEAD
import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { FB_RESOLVE } from "../../queries";
import SignupForm from "./SignupForm";
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
const LOGIN = gql`
  mutation($phone: String!) {
    login(phone: $phone) {
      token
      access
    }
  }
`;

const CREATE_USER = gql`
  mutation(
    $username: String!
    $email: String!
    $phone: String!
    $gender: String!
    $interestedIn: [String]
    $dob: String!
    $lang: String
  ) {
    createUser(
      username: $username
      email: $email
      phone: $phone
      gender: $gender
      interestedIn: $interestedIn
      dob: $dob
      lang: $lang
    ) {
      token
      access
    }
  }
`;
class Signup extends PureComponent {
  state = { ...initialState };

  componentDidMount() {
    this.mounted = true;
    const { mem, eve, ErrorHandler, toast, t, tReady } = this.props;
    ErrorHandler.setBreadcrumb("Signup loaded");
    if (mem || eve) {
      toast.info(tReady ? t("common:pleaselogin") : "Please login first");
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  clearState = () => {
    if (this.mounted) {
      this.setState({ ...initialState });
    }
  };

  setFormValues = values => {
    if (this.mounted) {
      this.setState(values);
    }
  };

  handleFirebaseReturn = ({ state, code }, fbResolve) => {
    if (!state || !code) {
      return;
    }
    if (this.mounted) {
      const { ErrorHandler, history, ReactGA } = this.props;
      this.setState(
        {
          csrf: state,
          code
        },
        () => {
          fbResolve()
            .then(({ data }) => {
              const { isCouple } = this.state;
              if (data.fbResolve === null) {
                ReactGA.event({
                  category: "Signup",
                  action: "Fail"
                });
                alert("Signup failed.");
                return;
              }
              ReactGA.event({
                category: "Signup",
                action: "Success"
              });
              localStorage.setItem(
                "token",
                data.fbResolve.find(token => token.access === "auth").token
              );
              localStorage.setItem(
                "refreshToken",
                data.fbResolve.find(token => token.access === "refresh").token
              );

              if (isCouple) {
                ReactGA.event({
                  category: "Signup",
                  action: "Couple"
                });
                history.push({
                  pathname: "/settings",
                  state: { couple: true, initial: true }
                });
              } else {
                history.push({
                  pathname: "/settings",
                  state: { initial: true }
                });
              }
            })
            .catch(res => {
              ErrorHandler.catchErrors(res.graphQLErrors);
            });
        }
      );
    }
  };

  handleFBReturn = ({ state, code }, fbResolve) => {
    if (!state || !code) {
      return;
    }
    if (this.mounted) {
      const { ErrorHandler, history, ReactGA } = this.props;
      this.setState(
        {
          csrf: state,
          code
        },
        () => {
          fbResolve()
            .then(({ data }) => {
              const { isCouple } = this.state;
              if (data.fbResolve === null) {
                ReactGA.event({
                  category: "Signup",
                  action: "Fail"
                });
                alert("Signup failed.");
                return;
              }
              ReactGA.event({
                category: "Signup",
                action: "Success"
              });
              localStorage.setItem(
                "token",
                data.fbResolve.find(token => token.access === "auth").token
              );
              localStorage.setItem(
                "refreshToken",
                data.fbResolve.find(token => token.access === "refresh").token
              );

              if (isCouple) {
                ReactGA.event({
                  category: "Signup",
                  action: "Couple"
                });
                history.push({
                  pathname: "/settings",
                  state: { couple: true, initial: true }
                });
              } else {
                history.push({
                  pathname: "/settings",
                  state: { initial: true }
                });
              }
            })
            .catch(res => {
              ErrorHandler.catchErrors(res.graphQLErrors);
            });
        }
      );
    }
  };

  //TODO:DELETE THIS PRE LAUNCH

  testCreateUser = createUser => {
    if (this.mounted) {
      const rand = Math.floor(10000000 + Math.random() * 1000);
      this.setState(
        {
          phone: rand.toString(),
          username: "TEST USER",
          email: rand.toString() + "@test.com",
          dob: "12/12/1990",
          interestedIn: ["M"],
          gender: "M",
          isCouple: true
        },
        () =>
          createUser()
            .then(({ data }) => {
              if (data.createUser === null) {
                alert("Signup failed.");
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

              const { isCouple } = this.state;
              if (isCouple) {
                this.props.history.push({
                  pathname: "/settings",
                  state: { couple: true, initial: true }
                });
              } else {
                this.props.history.push({
                  pathname: "/settings",
                  state: { initial: true }
                });
              }
            })
            .catch(res => {
              this.props.ErrorHandler.catchErrors(res.graphQLErrors);
            })
      );
    }
  };

  handleLogin = login => {
    //if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    if (this.mounted) {
      login()
        .then(async ({ data }) => {
          if (data.login === null) {
            alert(this.props.t("phoneexist"));
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

          this.props.history.push("/members");
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          return errors;
        });
    }
    // }
  };

  render() {
    const {
      t,
      setBreadcrumb,
      ErrorHandler,
      lang,
      refer,
      aff,
      history,
      toast
    } = this.props;

    let {
      csrf,
      code,
      phone,
      username,
      email,
      dob,
      interestedIn,
      gender,
      isCouple
    } = this.state;

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
          lang: localStorage.getItem("i18nextLng")
        }}
      >
        {createUser => {
          return (
            <Mutation
              mutation={FB_RESOLVE}
              variables={{
                csrf,
                code,
                username,
                email,
                dob,
                interestedIn,
                gender,
                isCouple,
                lang,
                isCreate: true,
                refer,
                aff
              }}
            >
              {fbResolve => {
                return (
                  <div className="register-form">
                    <div className="head">
                      {t("Become a")} <b>Foxtail</b> {t("Member")}
                    </div>
                    <SignupForm
                      fbResolve={fbResolve}
                      handleFirebaseReturn={this.handleFirebaseReturn}
                      setFormValues={this.setFormValues}
                      setBreadcrumb={setBreadcrumb}
                      t={t}
                      ErrorHandler={ErrorHandler}
                      history={history}
                      lang={lang}
                      toast={toast}
                    />
                    <div className="form terms">
                      <span onClick={() => this.testCreateUser(createUser)}>
                        Test Create
                      </span>
                      <br />
                      <br />
                      Test Users:
                      <Mutation mutation={LOGIN} variables={{ phone }}>
                        {(login, { loading, error }) => {
                          return (
                            <>
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
                                  this.setState({ phone: "4" }, () =>
                                    this.handleLogin(login)
                                  );
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
                            </>
                          );
                        }}
                      </Mutation>
                    </div>
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
=======
import React from "react";
import SignupForm from "./SignupForm";

const Signup = props => {
  return (
    <div className="register-form">
      <div className="head">
        {props.t("Become a")} <b>Foxtail</b> {props.t("Member")}
      </div>
      <SignupForm {...props} />
    </div>
  );
};
>>>>>>> master

export default Signup;
