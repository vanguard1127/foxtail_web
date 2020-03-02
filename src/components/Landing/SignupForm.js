import React, { Component } from "react";
import * as yup from "yup";
import { DatePicker } from "@material-ui/pickers";

import Dropdown from "../common/Dropdown";
import SignupButton from "./SignupButton";
let date = new Date();
date.setFullYear(date.getFullYear() - 18);

class SignupForm extends Component {
  schema = yup.object().shape({
    interestedIn: yup.array().required("intrstreq"),
    sex: yup.string().required("genreq"),
    dob: yup
      .date()
      .nullable()
      .default(null)
      .max(date, "18old")
      .required("birthreq"),
    email: yup
      .string()
      .email("invemail")
      .required("emailreq"),
    username: yup
      .string()
      .required("userreq")
      .matches(/^.[a-zA-Z0-9]+$/, {
        message: "common:Alphanumeric characters only"
      })
      .min(3, "usernameLen")
      .max(30, "usernameLen")
  });

  state = {
    username: "",
    email: "",
    dob: null,
    sex: "",
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
      sex,
      interestedIn,
      isCouple,
      isValid,
      errors
    } = this.state;

    if (
      username !== nextState.username ||
      email !== nextState.email ||
      dob !== nextState.dob ||
      sex !== nextState.sex ||
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
    const { mem, eve, ErrorHandler, toast, t } = this.props;
    ErrorHandler.setBreadcrumb("Signup Form loaded");
    if (mem || eve) {
      toast.info(t("Please login first"));
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setValue = ({ name, value, dontVer }) => {
    if (this.mounted) {
      this.setState({ [name]: value }, () => {
        if (!dontVer) {
          this.validateForm();
        }
      });
    }
  };

  setFormValues = values => {
    if (this.mounted) {
      this.setState(values);
    }
  };

  validateForm = async () => {
    try {
      if (this.mounted) {
        await this.schema.validate(this.state);
        this.setState({ isValid: true, errors: {} });
        this.setFormValues(this.state);
        return true;
      }
    } catch (e) {
      let errors = { [e.path]: e.message };
      this.setState({ isValid: false, errors });
      return false;
    }
  };

  InputFeedback = error =>
    error ? <div className="input-feedback">{error}</div> : null;

  render() {
    const { t, ErrorHandler, lang, refer, aff, history, ReactGA } = this.props;

    const {
      username,
      email,
      dob,
      sex,
      interestedIn,
      isCouple,
      isValid,
      errors
    } = this.state;

    return (
      <form>
        <div className="form-content">
          <div className="form-fields">
            <div className="input username">
              <input
                name="username"
                aria-label="username"
                placeholder={t("userLbl")}
                type="text"
                onChange={e => {
                  this.setValue({
                    name: "username",
                    value: e.target.value,
                    dontVer: true
                  });
                }}
                onBlur={e => {
                  this.setValue({
                    name: "username",
                    value: e.target.value
                  });
                }}
                value={username}
              />
              {this.InputFeedback(t(errors.username))}
            </div>
            <div className="input email">
              <input
                name="email"
                aria-label="email"
                placeholder={t("emailLbl")}
                type="email"
                inputMode="email"
                onChange={e => {
                  this.setValue({
                    name: "email",
                    value: e.target.value
                  });
                }}
                value={email}
              />
              {this.InputFeedback(t(errors.email))}
            </div>
            <div className="input">
              <DatePicker
                name="birthday"
                autoOk
                disableFuture
                openTo="year"
                variant="inline"
                initialFocusedDate={date}
                placeholder={t("Birthday")}
                InputProps={{
                  disableUnderline: true
                }}
                InputLabelProps={{
                  shrink: true
                }}
                classes={{ root: "datePickerInput" }}
                views={["year", "month", "date"]}
                value={dob}
                onChange={e => {
                  this.setValue({
                    name: "dob",
                    value: e.toISOString()
                  });
                }}
                maxDate={date}
                format="MMMM Do, YYYY"
              />
              {this.InputFeedback(t(errors.dob))}
            </div>
            <div className="input">
              <Dropdown
                value={sex}
                type={"sex"}
                onChange={e => {
                  this.setValue({
                    name: "sex",
                    value: e.value
                  });
                }}
                placeholder={t("common:Sex") + ":"}
                lang={lang}
                className="dropdown wide"
              />
              {this.InputFeedback(t(errors.sex))}
            </div>
            <div className="input">
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
                className="dropdown wide"
              />
              {this.InputFeedback(t(errors.interestedIn))}
            </div>
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
          </div>

          <SignupButton
            disabled={!isValid}
            createData={{
              username,
              email,
              dob,
              interestedIn,
              sex,
              isCouple,
              lang,
              isCreate: true,
              refer,
              aff
            }}
            setValue={this.setValue}
            validateForm={this.validateForm}
            ErrorHandler={ErrorHandler}
            t={t}
            lang={lang}
            history={history}
            ReactGA={ReactGA}
          />
          <div className="disclaim">
            {t(
              "This site uses your Phone Number to Authenticate your account ONLY"
            )}
          </div>
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
