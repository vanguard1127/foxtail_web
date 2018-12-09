import React, { Component } from "react";
import { DELETE_USER } from "../../queries";
import { Mutation } from "react-apollo";
import { message, Button } from "antd";
import { ApolloConsumer } from "react-apollo";

class DeactivateAcctBtn extends Component {
  handleSubmit = ({ client, deleteUser }) => {
    deleteUser()
      .then(({ data }) => {
        message.success("Account Deleted Successfully.");

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.clear();
        client.resetStore();

        this.props.history.push("/");
      })
      .catch(res => {
        console.log(res);
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  render() {
    return (
      <Mutation mutation={DELETE_USER}>
        {deleteUser => {
          return (
            <ApolloConsumer>
              {client => {
                return (
                  <Button
                    onClick={() =>
                      this.handleSubmit({
                        client,
                        deleteUser
                      })
                    }
                  >
                    Deactivate Account
                  </Button>
                );
              }}
            </ApolloConsumer>
          );
        }}
      </Mutation>
    );
  }
}

export default DeactivateAcctBtn;
