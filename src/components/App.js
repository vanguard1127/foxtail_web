import React, { Component } from "react";
import "./App.css";
import Signup from "../components/Auth/Signup";

class App extends Component {
  render() {
    return (
      <div className="twocolumn">
        <div className="centerRow">
          <h4>
            #1 FREE community for alternative relationships.
            <br /> Including polyamorus, cuddling, casual, threesomes,etc...
            <br /> Anything but vanilla
          </h4>
        </div>
        <div className="centerColumn">
          <Signup formStyle={{ width: "50%" }} />{" "}
        </div>
      </div>
    );
  }
}

export default App;
