import React from "react";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import BirthDatePicker from "./BirthDatePicker";
import Select from "../common/Select";
import InterestedInDropdown from "../common/InterestedInDropdown";
import SignupButton from "./SignupButton";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required!")
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
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting,
    disabled,
    fbResolve,
    createUser,
    handleFBReturn
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-content">
        <div className="input username">
          <Field name="username" placeholder="Username" type="text" />
        </div>
        <div className="input email">
          <Field name="email" placeholder="E-mail address" type="email" />
        </div>
        <BirthDatePicker
          name={"dob"}
          value={values["dob"]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Select
          label="Gender:"
          value={values["gender"]}
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
          options={[
            { label: "Female", value: "female" },
            { label: "Male", value: "male" },
            { label: "Transgender", value: "trans" },
            { label: "Non-Binary", value: "non" }
          ]}
        />

        <InterestedInDropdown
          label="Interested In:"
          value={values["interestedIn"]}
          onChange={el =>
            handleChange({
              target: {
                value: el,
                type: "text",
                id: "interestedIn",
                name: "interestedIn"
              }
            })
          }
          placeholder={"Interested In:"}
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
              <b>Are you couple?</b>
            </label>
          </div>
        </div>

        <SignupButton
          disabled={disabled}
          fbResolve={fbResolve}
          createUser={createUser}
          handleFBReturn={handleFBReturn}
        />
      </div>
    </form>
  );
};

const MyEnhancedForm = formikEnhancer(MyForm);

export default MyEnhancedForm;
