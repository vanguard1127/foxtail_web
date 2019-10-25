import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
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

  handleFirebaseReturn=(result, fbResolve)=>{
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
  }

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
                handleFirebaseReturn={this.handleFirebaseReturn}
                setFormValues={this.setFormValues}
                setBreadcrumb={setBreadcrumb}
                t={t}
                ErrorHandler={ErrorHandler}
                history={history}
                lang={lang}
                toast={toast}
              />
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
