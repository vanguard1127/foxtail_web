import React from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { LOGIN, FB_RESOLVE } from "../../queries";
import AccountKit from "react-facebook-account-kit";
import { Button, Icon } from "antd";
import Error from "../Error";

const initialState = {
  csrf: "",
  code: "",
  phone: ""
};

class Signin extends React.Component {
  state = { ...initialState };

  handleFBReturn = ({ state, code }, fbResolve, login) => {
    this.setState({
      csrf: state,
      code
    });
    fbResolve().then(({ data }) => {
      this.setState({ phone: data.fbResolve });
      login().then(async ({ data }) => {
        console.log(data.login.token);
        localStorage.setItem("token", data.login.token);
        //await this.props.refetch();
        this.props.history.push("/search");
      });
    });
  };

  render() {
    const { csrf, code, phone } = this.state;

    return (
      <div className="centerColumn fullHeight">
        <h2 className="App">Signin</h2>
        <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
          {(fbResolve, { data, loading, error }) => {
            return (
              <div>
                <Mutation mutation={LOGIN} variables={{ phone }}>
                  {(login, { data, loading, error }) => {
                    return (
                      <AccountKit
                        appId="172075056973555" // Update this!
                        version="v1.1" // Version must be in form v{major}.{minor}
                        onResponse={resp => {
                          this.handleFBReturn(resp, fbResolve, login);
                        }}
                        csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
                        countryCode={"+1"} // eg. +60
                        phoneNumber={"1111116711"} // eg. 12345678
                        emailAddress={"trses@dofo.com"} // eg. me@site.com
                      >
                        {p => (
                          <div>
                            <Button size="large" {...p}>
                              {" "}
                              <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                              />
                              Verify your phone number to begin
                            </Button>

                            <small>
                              <br />
                              Phone number will be used for login and not
                              marketing.
                            </small>
                          </div>
                        )}
                      </AccountKit>
                    );
                  }}
                </Mutation>
                {error && <Error error={error} />}
              </div>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signin);
