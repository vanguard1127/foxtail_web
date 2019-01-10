import React from "react";
import AccountKit from "react-facebook-account-kit";

const SignupButton = ({ fbResolve, createUser, disabled, handleFBReturn }) => {
  return (
    <AccountKit
      disabled={false}
      appId="172075056973555" // Update this!
      version="v1.1" // Version must be in form v{major}.{minor}
      onResponse={resp => {
        handleFBReturn(resp, fbResolve, createUser);
      }}
      csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
      countryCode={"+1"} // eg. +60
      phoneNumber={""} // eg. 12345678
      emailAddress={""} // eg. me@site.com
    >
      {p => (
        <div className="submit">
          <button className="btn" type="submit" {...p} disabled={false}>
            Get Started
          </button>
        </div>
      )}
    </AccountKit>
  );
};

export default SignupButton;
