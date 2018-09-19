import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_CURRENT_USER } from "../../queries";

const MyUserInfo = ({ session }) => {
  return (
    <Query query={GET_CURRENT_USER}>
      {({ data, loading, error }) => {
        if (loading) {
          return <div>Loading</div>;
        }
        if (error) {
          return <div>Error</div>;
        }

        return (
          <div className="App">
            <h2>{data.currentuser.username}</h2>
            <div>Ayy</div>
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(MyUserInfo);
