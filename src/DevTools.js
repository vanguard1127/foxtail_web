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
        console.error(res);
      });

    // }
  };

  render() {
    const { phone } = this.state;
    return (
      <div className="form terms">
        <Mutation mutation={LOGIN} variables={{ phone }}>
          {(login, { loading, error }) => {
            return (
              <div style={{ padding: 15 }}>
                {[1, 2, 3, 4, 5].map(el => (
                  <span
                    key={el}
                    style={{
                      padding: 15,
                      marginRight: 10,
                      border: "1px solid black",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      this.setState({ phone: `${el}` }, () => {
                        this.handleLogin(login);
                      });
                    }}
                  >
                    {el}
                  </span>
                ))}
              </div>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default DevTools;
