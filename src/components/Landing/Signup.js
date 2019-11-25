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

export default Signup;
