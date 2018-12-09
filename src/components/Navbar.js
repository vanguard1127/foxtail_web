import React, { Fragment, Component } from "react";
import { NavLink } from "react-router-dom";
import { Menu, message, Button } from "antd";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { LOGIN, FB_RESOLVE } from "../queries";
import AccountKit from "react-facebook-account-kit";
import Signout from "../components/Auth/Signout";

const initialState = {
  csrf: "",
  code: "",
  phone: ""
};
const Navbar = ({ session, history, refetch }) => (
  <Fragment>
    {session && session.currentuser ? (
      <NavbarAuth session={session} />
    ) : (
      <NavbarUnAuth history={history} refetch={refetch} />
    )}
  </Fragment>
);

class NavbarUnAuth extends Component {
  state = { ...initialState };
  handleFBReturn = ({ state, code }, fbResolve, login) => {
    this.setState({
      csrf: state,
      code
    });
    fbResolve()
      .then(({ data }) => {
        if (data.fbResolve === null) {
          message.warn("Login failed.");
          return;
        }
        this.setState({ phone: data.fbResolve });
        login()
          .then(async ({ data }) => {
            if (data.login === null) {
              message.warn("User doesn't exist.");
              return;
            }

            localStorage.setItem(
              "token",
              data.login.find(token => token.access === "auth").token
            );
            localStorage.setItem(
              "refreshToken",
              data.login.find(token => token.access === "refresh").token
            );
            await this.props.refetch();
            this.props.history.push("/members");
          })
          .catch(res => {
            const errors = res.graphQLErrors.map(error => {
              return error.message;
            });

            //TODO: send errors to analytics from here
            this.setState({ errors });
          });
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });
        this.setState({ errors });
      });
  };

  handleLogin = login => {
    login()
      .then(async ({ data }) => {
        if (data.login === null) {
          message.warn("User doesn't exist.");
          return;
        }

        localStorage.setItem(
          "token",
          data.login.find(token => token.access === "auth").token
        );
        localStorage.setItem(
          "refreshToken",
          data.login.find(token => token.access === "refresh").token
        );
        await this.props.refetch();
        this.props.history.push("/members");
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };
  render() {
    const { csrf, code, phone } = this.state;
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="1" style={{ backgroundColor: "transparent" }}>
          <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
            {fbResolve => {
              return (
                <div>
                  <Mutation mutation={LOGIN} variables={{ phone }}>
                    {(login, { loading, error }) => {
                      return (
                        <AccountKit
                          appId="172075056973555" // Update this!
                          version="v1.1" // Version must be in form v{major}.{minor}
                          onResponse={resp => {
                            this.handleFBReturn(resp, fbResolve, login);
                          }}
                          csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
                          countryCode={"+1"} // eg. +60
                          phoneNumber={""} // eg. 12345678
                          emailAddress={"trses@dofo.com"} // eg. me@site.com
                        >
                          {p => (
                            <NavLink
                              to="/"
                              {...p}
                              activeStyle={{
                                fontWeight: "bold",
                                color: "white",
                                backgroundColor: "transparent"
                              }}
                            >
                              Login
                            </NavLink>
                          )}
                        </AccountKit>
                      );
                    }}
                  </Mutation>
                </div>
              );
            }}
          </Mutation>
        </Menu.Item>
        <Menu.Item>
          <Mutation mutation={LOGIN} variables={{ phone: "1" }}>
            {(login, { loading, error }) => {
              return (
                <Button onClick={() => this.handleLogin(login)}>User 1</Button>
              );
            }}
          </Mutation>
        </Menu.Item>
        <Menu.Item>
          <Mutation mutation={LOGIN} variables={{ phone: "2" }}>
            {(login, { loading, error }) => {
              return (
                <Button onClick={() => this.handleLogin(login)}>User 2</Button>
              );
            }}
          </Mutation>
        </Menu.Item>
        <Menu.Item>
          <Mutation mutation={LOGIN} variables={{ phone: "3" }}>
            {(login, { loading, error }) => {
              return (
                <Button onClick={() => this.handleLogin(login)}>User 3</Button>
              );
            }}
          </Mutation>
        </Menu.Item>
        <Menu.Item>
          <Mutation mutation={LOGIN} variables={{ phone: "4" }}>
            {(login, { loading, error }) => {
              return (
                <Button onClick={() => this.handleLogin(login)}>User 4</Button>
              );
            }}
          </Mutation>
        </Menu.Item>
        <Menu.Item>
          <Mutation mutation={LOGIN} variables={{ phone: "5" }}>
            {(login, { loading, error }) => {
              return (
                <Button onClick={() => this.handleLogin(login)}>User 5</Button>
              );
            }}
          </Mutation>
        </Menu.Item>
        <Menu.Item>
          <Signout />
        </Menu.Item>
      </Menu>
    );
  }
}

//TODO: check it not id and try to make recursive
class NavbarAuth extends Component {
  render() {
    let href = window.location.href.split("/");
    href = href[3].concat(href[4] ? "/" + href[4] : "");
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["/"]}
        selectedKeys={["/" + href]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="/members">
          <NavLink to="/members">Meet Members</NavLink>
        </Menu.Item>
        <Menu.Item key="/events">
          <NavLink to="/events">Go to Events</NavLink>
        </Menu.Item>
        <Menu.Item key="/inbox">
          <NavLink to="/inbox">Inbox</NavLink>
        </Menu.Item>
        <Menu.Item key="/editprofile">
          <NavLink to="/editprofile">Edit Profile</NavLink>
        </Menu.Item>
        <Menu.Item key="/settings">
          <NavLink to="/settings">Settings</NavLink>
        </Menu.Item>

        <Signout />
      </Menu>
    );
  }
}

export default withRouter(Navbar);
