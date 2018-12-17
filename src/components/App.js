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
        <button onClick={() => changeLanguage("de")}>de</button>
        <button onClick={() => changeLanguage("en")}>en</button>
        <h1>{t("Welcome to React")}</h1>
        <h4>
          #1 FREE community for alternative relationships.
          <br /> Including polyamorus, cuddling, casual, threesomes,etc...
          <br /> Anything but vanilla
        </h4>
      </div>
      <div className="centerColumn">
        <Signup formStyle={{ width: "100%" }} />{" "}
      </div>
    </div>
  );
};

export default withNamespaces()(App);
