import React, { Component } from "react";
import * as yup from "yup";
import DatePicker from "../common/DatePicker";
import Dropdown from "../common/Dropdown";
import SignupButton from "./SignupButton";
import isEmpty from "../../utils/isEmpty.js";

let date = new Date();
date.setFullYear(date.getFullYear() - 18);

class SignupForm extends Component {
  schema = yup.object().shape({
    interestedIn: yup.array().required(this.props.t("intrstreq")),
    gender: yup.string().required(this.props.t("genreq")),
    dob: yup
      .date()
      .default(undefined)
      .max(date, this.props.t("18old"))
      .required(this.props.t("birthreq")),
    email: yup
      .string()
      .email(this.props.t("invemail"))
      .required(this.props.t("emailreq")),
    username: yup
      .string()
      .required(this.props.t("userreq"))
      .min(3, this.props.t("usernameLen"))
      .max(30, this.props.t("usernameLen"))
  });
  state = {
    username: "",
    email: "",
    dob: undefined,
    gender: "",
    interestedIn: [],
    isCouple: false,
    isValid: false,
    errors: {}
  };
  shouldComponentUpdate(nextProps, nextState) {
    const {
      username,
      email,
      dob,
      gender,
      interestedIn,
      isCouple,
      isValid,
      errors
    } = this.state;

    if (
      username !== nextState.username ||
      email !== nextState.email ||
      dob !== nextState.dob ||
      gender !== nextState.gender ||
      interestedIn.length !== nextState.interestedIn.length ||
      isCouple !== nextState.isCouple ||
      isValid !== nextState.isValid ||
      errors !== nextState.errors ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    this.mounted = true;
    this.props.ErrorHandler.setBreadcrumb("Signup Form loaded");
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  setValue = ({ name, value }) => {
    if (this.mounted) {
      this.setState({ [name]: value }, () => {
        if (!isEmpty(this.state.errors)) {
          this.validateForm();
        } else {
          this.props.setFormValues(this.state);
        }
      });
    }
  };

  validateForm = async () => {
    try {
      if (this.mounted) {
        await this.schema.validate(this.state);
        this.setState({ isValid: true, errors: {} });
        this.props.setFormValues(this.state);
        return true;
      }
    } catch (e) {
      let errors = { [e.path]: e.message };

      this.setState({ isValid: false, errors });
      return false;
    }
  };

  InputFeedback = error =>
    error ? (
      <div className="input-feedback" style={{ color: "red" }}>
        {error}
      </div>
    ) : null;

  render() {
    const { fbResolve, handleFBReturn, t, history, lang } = this.props;

    const {
      username,
      email,
      dob,
      gender,
      interestedIn,
      isCouple,
      isValid,
      errors
    } = this.state;

    return (
      <form>
        <div className="form-content">
          <div className="input username">
            <input
              aria-label="username"
              placeholder={t("userLbl")}
              type="text"
              onChange={e => {
                this.setValue({
                  name: "username",
                  value: e.target.value
                });
              }}
              value={username}
            />
            {this.InputFeedback(errors.username)}
          </div>
          <div className="input email">
            <input
              aria-label="email"
              placeholder={t("emailLbl")}
              type="email"
              onChange={e => {
                this.setValue({
                  name: "email",
                  value: e.target.value
                });
              }}
              value={email}
            />
            {this.InputFeedback(errors.email)}
          </div>
          <DatePicker
            value={dob}
            onChange={e => {
              this.setValue({
                name: "dob",
                value: e
              });
            }}
            t={t}
            type="birthday"
          />
          {this.InputFeedback(errors.dob)}
          <Dropdown
            value={gender}
            type={"gender"}
            onChange={e => {
              this.setValue({
                name: "gender",
                value: e.value
              });
            }}
            placeholder={t("common:Gender") + ":"}
            lang={lang}
          />
          {this.InputFeedback(errors.gender)}

          <Dropdown
            value={interestedIn}
            type={"interestedIn"}
            onChange={el => {
              this.setValue({
                name: "interestedIn",
                value: el.map(e => e.value)
              });
            }}
            placeholder={t("common:Interested") + ":"}
            lang={lang}
          />
          {this.InputFeedback(errors.interestedIn)}
          <div className="couple-choose">
            <div className="select-checkbox">
              <input
                type="checkbox"
                id="cbox"
                checked={isCouple}
                onChange={el => {
                  this.setValue({
                    name: "isCouple",
                    value: el.target.checked
                  });
                }}
              />
              <label htmlFor="cbox">
                <span />
                <b>{t("coupleBox")}</b>
              </label>
            </div>
          </div>
          <SignupButton
            disabled={!isValid}
            fbResolve={fbResolve}
            handleFBReturn={handleFBReturn}
            setValue={this.setValue}
            validateForm={this.validateForm}
            t={t}
            lang={lang}
          />
          <div className="terms">
            {t("signupMsg")}
            <span onClick={() => history.push("/tos")}>{t("terms")}</span> &
            <span onClick={() => history.push("/privacy")}>{t("privacy")}</span>
          </div>
        </div>
      </form>
    );
  }
}

export default SignupForm;
