import React from "react";
import FirebaseAuth from "../common/FirebaseAuth";

//POSIBLE BACKUP:https://github.com/floodfx/react-account-kit-web
const SignupButton = ({
  fbResolve,
  disabled,
  handleFirebaseReturn,
  ErrorHandler,
  validateForm,
  phoneNumber,
  t,
  lang
}) => {
  return (
    <FirebaseAuth
      csrf={"889306f7553962e44db6ed508b4e8266"}
      phoneNumber={phoneNumber} // eg. 12345678
      language={lang}
      validateForm={validateForm}
      disabled={disabled}
      ErrorHandler={ErrorHandler}
      onResponse={resp => handleFirebaseReturn(resp, fbResolve)}
      type="signup"
    >
      <div className="submit">
        <button className="btn">{t("getstarted")}</button>
      </div>
    </FirebaseAuth>
  );
};

export default SignupButton;
