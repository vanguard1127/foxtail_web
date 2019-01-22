import React from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { CREATE_USER, FB_RESOLVE, LOGIN } from "../../queries";
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

  setFormValues = values => {
    this.setState(values);
  };

  handleFBReturn = ({ state, code }, fbResolve, createUser) => {
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
              alert("Phone verification failed.");
              return;
            }
            this.setState({ phone: data.fbResolve });
            createUser()
              .then(async ({ data }) => {
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
  };

  testCreateUser = createUser => {
    const { isCouple } = this.state;

    const rand = Math.floor(Math.random() * 1000);
    this.setState(
      {
        phone: rand.toString(),
        username: "TEST USER",
        email: rand.toString() + "@test.com",
        dob: "12/12/1990",
        interestedIn: ["M"],
        gender: "M",
        isCouple: false,
        lang: "en"
      },
      () =>
        createUser()
          .then(async ({ data }) => {
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

  //TODO:DELETE THIS
  handleLogin = login => {
    login()
      .then(async ({ data }) => {
        if (data.login === null) {
          alert("User doesn't exist.");
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
    const { t, lang } = this.props;
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
                      {t("Become a")} <b>Foxtail</b> {t("Member")}
                    </div>
                    <SignupForm
                      fields={{
                        username: "",
                        email: "",
                        dob: "",
                        interestedIn: [],
                        gender: "",
                        isCouple: false
                      }}
                      disabled={loading}
                      fbResolve={fbResolve}
                      createUser={createUser}
                      handleFBReturn={this.handleFBReturn}
                      setFormValues={this.setFormValues}
                      t={t}
                      lang={lang}
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
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(Signup);
