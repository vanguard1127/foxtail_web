import React, { Component } from "react";
import "./App.css";
import { Mutation } from "react-apollo";
import { FB_RESOLVE } from "../queries";

import AccountKit from "react-facebook-account-kit";

const initialState = {
  csrf: "",
  code: ""
};

class App extends Component {
  state = {
    csrf: "",
    code: ""
  };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleFBReturn = ({ state, code }, fbResolve) => {
    console.log("curr", this.state);
    this.setState({
      csrf: state,
      code
    });
    fbResolve().then(({ data }) => {
      console.log(data);
    });
  };

  render() {
    const { csrf, code } = this.state;
    return (
      <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
        {(fbResolve, { data, loading, error }) => {
          if (loading) {
            return <div>Loading</div>;
          }
          if (error) {
            return <div>{error.message}</div>;
          }
          return (
            <div className="App">
              <h1>TEST</h1>
              <AccountKit
                appId="172075056973555" // Update this!
                version="v1.1" // Version must be in form v{major}.{minor}
                onResponse={resp => {
                  this.handleFBReturn(resp, fbResolve);
                }}
                csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
                countryCode={"+1"} // eg. +60
                phoneNumber={"1111116711"} // eg. 12345678
                emailAddress={"trses@dofo.com"} // eg. me@site.com
              >
                {p => (
                  <div>
                    <button {...p}>Initialize Account Kit</button>
                  </div>
                )}
              </AccountKit>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default App;
