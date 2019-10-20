import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const LOGIN = gql`
  mutation($phone: String!) {
    login(phone: $phone) {
      token
      access
    }
  }
`;

class DevTools extends Component {
  state = { phone: "" };
  handleLogin = login => {
    login()
      .then(async ({ data }) => {
        if (data.login === null) {
          alert(this.props.t("phoneexist"));
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
        window.location.replace("/members");
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        return errors;
      });

    // }
  };
  render() {
    const { phone } = this.state;
    return (
      <div className="form terms">
        Test Users:
        <Mutation mutation={LOGIN} variables={{ phone }}>
          {(login, { loading, error }) => {
            return (
              <>
                <span
                  onClick={() => {
                    this.setState({ phone: "1" }, () => {
                      this.handleLogin(login);
                    });
                  }}
                >
                  1
                </span>{" "}
                <span
                  onClick={() => {
                    this.setState({ phone: "2" }, () => {
                      this.handleLogin(login);
                    });
                  }}
                >
                  2
                </span>{" "}
                <span
                  href={null}
                  onClick={() => {
                    this.setState({ phone: "3" }, () => {
                      this.handleLogin(login);
                    });
                  }}
                >
                  3
                </span>{" "}
                <span
                  onClick={() => {
                    this.setState({ phone: "4" }, () =>
                      this.handleLogin(login)
                    );
                  }}
                >
                  4
                </span>
                <span
                  onClick={() => {
                    this.setState({ phone: "5" }, () => {
                      this.handleLogin(login);
                    });
                  }}
                >
                  5
                </span>
              </>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default DevTools;
