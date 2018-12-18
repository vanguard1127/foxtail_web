import i18n from "../i18n";
import React from "react";
import "./App.css";
import Signup from "../components/Auth/Signup";

import { withNamespaces } from "react-i18next";

const App = ({ t }) => {
  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="twocolumn">
      <div className="centerRow">
        <p>
          <h2>#1 FREE dating site alternative relationships.</h2>
          <br /> <h4>Feed Your Sexuality</h4>
        </p>
      </div>
      <div className="centerColumn">
        <Signup formStyle={{ width: "100%" }} />{" "}
      </div>
    </div>
  );
};

export default withNamespaces()(App);
