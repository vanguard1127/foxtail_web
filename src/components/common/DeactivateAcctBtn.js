import React from "react";
import { DELETE_USER } from "../../queries";
import { Mutation } from "react-apollo";
import { ApolloConsumer } from "react-apollo";

const DeactivateAcctBtn = ({ t }) => {
  const handleSubmit = ({ client, deleteUser }) => {
    deleteUser()
      .then(({ data }) => {
        alert(t("common:acctdeleted") + ".");

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.clear();
        client.resetStore();

        this.props.history.push("/");
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  return (
    <Mutation mutation={DELETE_USER}>
      {deleteUser => {
        return (
          <ApolloConsumer>
            {client => {
              return (
                <button
                  onClick={() =>
                    handleSubmit({
                      client,
                      deleteUser
                    })
                  }
                >
                  {t("common:deactacct")}
                </button>
              );
            }}
          </ApolloConsumer>
        );
      }}
    </Mutation>
  );
};

export default DeactivateAcctBtn;
