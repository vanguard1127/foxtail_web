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
        <div>
          #1 FREE dating site alternative relationships.
          <br /> <small>Feed Your Sexuality</small>
        </div>
      </div>
      <div className="centerColumn">
        <Signup formStyle={{ width: "100%" }} />{" "}
      </div>
    </div>
  );
};

export default withNamespaces()(App);
