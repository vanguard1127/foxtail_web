import React, { Component } from "react";
import "./App.css";
import Signup from "../components/Auth/Signup";
import LoginButton from "../components/Auth/LoginButton";
import LanguageControl from "./common/LanguageControl/LanguageControl";

import { withNamespaces } from "react-i18next";

const App = () => {
  return (
    <div>
      <header className="landing">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-4">
                <div className="logo">
                  <span />
                </div>
              </div>
              <div className="offset-md-3 col-md-5">
                <div className="content">
                  <LoginButton />
                  <LanguageControl lang={"en"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="landing">
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <div className="col-lg-7 col-md-12">
                  <div className="left">
                    <div className="welcome-text">
                      <h1>
                        #1 FREE dating community for alternative relationships
                      </h1>
                      <span className="title">Feed Your Sexuality</span>
                    </div>
                    <div className="stats">
                      <div className="head">
                        <span>Welcome</span> <span>Foxtail Stats</span>
                      </div>
                      <ul>
                        <li>
                          <span className="counter">19.528</span>
                          <span>Male Member</span>
                        </li>
                        <li>
                          <span className="counter">22.882</span>
                          <span>Female Member</span>
                        </li>
                        <li>
                          <span className="counter">5823</span>
                          <span>Couple Profile</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12">
                  <Signup />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-4">
                <span className="created">
                  Foxtail © 2018 Created by <span>Foxtail</span>
                </span>
              </div>
              <div className="offset-md-2 col-md-6">
                <div className="links">
                  <ul>
                    <li>
                      <span>Terms</span>
                    </li>
                    <li>
                      <span>Privacy</span>
                    </li>
                    <li>
                      <span>FAQ</span>
                    </li>
                    <li>
                      <span>About</span>
                    </li>
                    <li>
                      <span>Support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default withNamespaces()(App);
