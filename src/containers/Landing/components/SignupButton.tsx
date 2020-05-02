import React, { memo, useState } from "react";

import FirebaseAuth from "components/common/FirebaseAuth";

interface ICreateData {
  username: string;
  email: string;
  dob: any;
  interestedIn: string[];
  sex: string;
  isCouple: boolean;
  lang: string;
  isCreate: boolean;
  refer: string | null;
  aff: string | null;
}

interface ISignupButtonProps {
  disabled: boolean;
  createData: ICreateData;
  validateForm: () => Promise<boolean>;
  ErrorHandler: any;
  lang: string;
  ReactGA: any;
  history: any;
  t: any;
}

const SignupButton: React.FC<ISignupButtonProps> = memo(({
  disabled,
  createData,
  validateForm,
  ErrorHandler,
  lang,
  ReactGA,
  history,
  t,
}) => {
  // TODO Remove state after discussion, it is not used
  const [state, setState] = useState<{ code: string, password: string }>({
    code: '',
    password: '',
  });

  const success = data => {
    if (!data.fbResolve || data.fbResolve.length === 0) {
      ReactGA.event({
        category: "Signup",
        action: "Fail"
      });
      alert(t("Signup failed."));
      return;
    }
    localStorage.setItem(
      "token",
      data.fbResolve.find(token => token.access === "auth").token
    );
    localStorage.setItem(
      "refreshToken",
      data.fbResolve.find(token => token.access === "refresh").token
    );

    ErrorHandler.setBreadcrumb("Signup OK, Single");
    ReactGA.event({
      category: "Signup",
      action: "Success"
    });
    history.push({
      pathname: "/get-started",
      state: { initial: true }
    });
  };

  const fail = err => {
    ErrorHandler.catchErrors(err);
  };

  return (
    <FirebaseAuth
      language={lang}
      validateForm={validateForm}
      disabled={disabled}
      ErrorHandler={ErrorHandler}
      type="signup"
      createData={{
        ...createData,
        // TODO remove the line below, not used
        ...state,
        csrf: process.env.REACT_APP_CSRF
      }}
      t={t}
      title={t("pleasever")}
      success={success}
      fail={fail}
    >
      <div className="submit">
        <button className="btn">{t("getstarted")}</button>
      </div>
    </FirebaseAuth>
  );
});

export default SignupButton;
