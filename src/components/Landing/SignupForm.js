import React from "react";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import DatePicker from "../common/DatePicker";
import Dropdown from "../common/Dropdown";
import SignupButton from "./SignupButton";

let date = new Date();
date.setFullYear(date.getFullYear() - 18);
const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required!"),
    username: Yup.string().required("Username is required!"),
    dob: Yup.date()
      .max(date)
      .required("Birthdate is required!"),
    interestedIn: Yup.array().required("Interest is required!"),
    gender: Yup.string().required("Gender is required!")
  }),

  mapPropsToValues: ({ fields }) => ({
    ...fields
  }),

  handleSubmit: (payload, { props }) => {
    props.setFormValues(payload);
  },
  displayName: "MyForm"
});

const InputFeedback = ({ error }) =>
  error ? <div className="input-feedback">{error}</div> : null;

const MyForm = props => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    disabled,
    fbResolve,
    createUser,
    handleFBReturn,
    t
  } = props;
  const lang = localStorage.getItem("i18nextLng");

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-content">
        <div className="input username">
          <Field name="username" placeholder={t("userLbl")} type="text" />
        </div>
        <div className="input email">
          <Field name="email" placeholder={t("emailLbl")} type="email" />
        </div>
        <DatePicker
          name={"dob"}
          value={values["dob"]}
          onChange={el => {
            handleChange({
              target: {
                value: el,
                type: "text",
                id: "dob",
                name: "dob"
              }
            });
          }}
          onBlur={handleBlur}
          t={t}
          type="birthday"
        />
        <Dropdown
          value={values["gender"]}
          type={"gender"}
          onChange={el =>
            handleChange({
              target: {
                value: el.value,
                type: "text",
                id: "gender",
                name: "gender"
              }
            })
          }
          placeholder={t("common:Gender") + ":"}
          lang={lang}
        />

        <Dropdown
          value={values["interestedIn"]}
          type={"interestedIn"}
          onChange={el =>
            handleChange({
              target: {
                value: el.map(e => e.value),
                type: "text",
                id: "interestedIn",
                name: "interestedIn"
              }
            })
          }
          placeholder={t("common:Interested") + ":"}
          lang={lang}
        />
        <div className="couple-choose">
          <div className="select-checkbox">
            <input
              type="checkbox"
              id="cbox"
              checked={values["isCouple"]}
              onChange={el => {
                handleChange({
                  target: {
                    checked: el.target.checked,
                    type: "checkbox",
                    id: "isCouple",
                    name: "isCouple"
                  }
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
          disabled={disabled}
          fbResolve={fbResolve}
          createUser={createUser}
          handleFBReturn={handleFBReturn}
          t={t}
        />
        <div className="terms">
          {t("signupMsg")}
          <span>{t("tnp")}</span>
        </div>
      </div>
    </form>
  );
};

const SignupForm = formikEnhancer(MyForm);

export default SignupForm;
