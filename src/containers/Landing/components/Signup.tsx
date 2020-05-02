import React, { memo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { DatePicker } from "@material-ui/pickers";

import Dropdown from "components/common/Dropdown";

import SignupButton from "./SignupButton";

const date = new Date();
date.setFullYear(date.getFullYear() - 18);

interface ISignupFormData {
  username: string;
  email: string;
  dob: null;
  sex: string;
  interestedIn: string[];
  isCouple: boolean;
  isValid: boolean;
  errors: any;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required("userreq")
    .matches(/^.[a-zA-Z0-9]+$/, {
      message: "common:Alphanumeric characters only"
    })
    .min(3, "usernameLen")
    .max(30, "usernameLen"),
  email: yup
    .string()
    .email("invemail")
    .required("emailreq"),
  dob: yup
    .date()
    .nullable()
    .default(null)
    .max(date, "18old")
    .required("birthreq"),
  sex: yup.string().required("genreq"),
  interestedIn: yup.array().required("intrstreq"),
});

interface ISignupProps {
  ErrorHandler: any;
  lang: string;
  ReactGA: any;
  history: any;
  refer: string | null;
  aff: string | null;
  mem: string | null;
  eve: string | null;
  t: any;
}

const Signup: React.FC<ISignupProps> = memo(({
  ErrorHandler,
  lang,
  ReactGA,
  history,
  refer,
  aff,
  mem,
  eve,
  t,
}) => {

  const [state, setState] = useState<ISignupFormData>({
    username: "",
    email: "",
    dob: null,
    sex: "",
    interestedIn: [],
    isCouple: false,
    isValid: false,
    errors: {}
  });

  useEffect(() => {
    ErrorHandler.setBreadcrumb("Signup Form loaded");
    if (mem || eve) {
      toast.info(t("Please login first"));
    }
  }, []);

  const setValue = ({ name, value, dontVer }: { name: string, value: any, dontVer?: boolean }) => {
    const nextState = { ...state, [name]: value };
    setState(nextState);
    if (!dontVer) {
      validateForm(nextState);
    }
  };

  const validateForm = async (nextState: ISignupFormData = state) => {
    try {
      await schema.validate(nextState);
      setState({ ...nextState, isValid: true, errors: {} })
      return true;
    } catch (e) {
      const errors = { [e.path]: e.message };
      setState({ ...nextState, isValid: false, errors });
      return false;
    }
  };

  const InputFeedback = error =>
    error ? <div className="input-feedback">{error}</div> : null;

  const initDate = new Date();
  initDate.setFullYear(initDate.getFullYear() - 18);

  return (
    <div className="register-form">
      <div className="head">
        {t("Become a")} <b>Foxtail</b> {t("Member")}
      </div>
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
                  setValue({
                    name: "username",
                    value: e.target.value,
                    dontVer: true
                  });
                }}
                onBlur={e => {
                  setValue({
                    name: "username",
                    value: e.target.value
                  });
                }}
                value={state.username}
              />
              {InputFeedback(t(state.errors.username))}
            </div>
            <div className="input email">
              <input
                name="email"
                aria-label="email"
                placeholder={t("emailLbl")}
                type="email"
                inputMode="email"
                onChange={e => {
                  setValue({
                    name: "email",
                    value: e.target.value
                  });
                }}
                value={state.email}
              />
              {InputFeedback(t(state.errors.email))}
            </div>
            <div className="input">
              <DatePicker
                name="birthday"
                autoOk
                disableFuture
                openTo="year"
                variant="inline"
                initialFocusedDate={initDate}
                placeholder={t("Birthday")}
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{ shrink: true }}
                classes={{ root: "datePickerInput" }}
                views={["year", "month", "date"]}
                value={state.dob}
                onChange={e => {
                  setValue({
                    name: "dob",
                    value: e.toISOString()
                  });
                }}
                maxDate={date}
                format="MMMM Do, YYYY"
              />
              {InputFeedback(t(state.errors.dob))}
            </div>
            <div className="input">
              <Dropdown
                value={state.sex}
                type="sex"
                onChange={e => {
                  setValue({
                    name: "sex",
                    value: e.value
                  });
                }}
                placeholder={t("common:Sex") + ":"}
                lang={lang}
                className="dropdown wide"
              />
              {InputFeedback(t(state.errors.sex))}
            </div>
            <div className="input">
              <Dropdown
                value={state.interestedIn}
                type={"interestedIn"}
                multiple
                onChange={el => {
                  setValue({
                    name: "interestedIn",
                    value: el.map(e => e.value)
                  });
                }}
                placeholder={t("common:Interested") + ":"}
                lang={lang}
                className="dropdown wide"
              />
              {InputFeedback(t(state.errors.interestedIn))}
            </div>
            <div className="couple-choose">
              <div className="select-checkbox">
                <input
                  type="checkbox"
                  id="cbox"
                  checked={state.isCouple}
                  onChange={el => {
                    setValue({
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
            disabled={!state.isValid}
            createData={{
              username: state.username,
              email: state.email,
              dob: state.dob,
              interestedIn: state.interestedIn,
              sex: state.sex,
              isCouple: state.isCouple,
              lang,
              isCreate: true,
              refer,
              aff
            }}
            validateForm={validateForm}
            ErrorHandler={ErrorHandler}
            lang={lang}
            ReactGA={ReactGA}
            history={history}
            t={t}
          />
          <div className="disclaim">
            {t("This site uses your Phone Number to Authenticate your account ONLY")}
          </div>
          <div className="terms">
            {t("signupMsg")}
            <span onClick={() => history.push("/tos")}>{t("terms")}</span> &
            <span onClick={() => history.push("/privacy")}>{t("privacy")}</span>
          </div>
        </div>
      </form>
    </div>
  );
});

export default Signup;
