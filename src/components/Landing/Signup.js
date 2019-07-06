import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESOLVE, LOGIN } from "../../queries";
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

class Signup extends PureComponent {
  state = { ...initialState };

  componentDidMount() {
    this.mounted = true;
    const { mem, eve, ErrorHandler, toast, t } = this.props;
    ErrorHandler.setBreadcrumb("Signup loaded");
    if (mem || eve) {
      toast.info(t("common:pleaselogin"));
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
  handleLogin = login => {
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
      history
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
                handleFBReturn={this.handleFBReturn}
                setFormValues={this.setFormValues}
                setBreadcrumb={setBreadcrumb}
                t={t}
                ErrorHandler={ErrorHandler}
                history={history}
                lang={lang}
              />
              <div className="form terms">
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
  }
}

export default Signup;
