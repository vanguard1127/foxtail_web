import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_MY_PROFILE } from "../../queries";
import Error from "../common/Error";
import Spinner from "../common/Spinner";

const MyProfileInfo = ({ session }) => {
  return (
    <Query query={GET_MY_PROFILE}>
      {({ data, loading, error }) => {
        if (loading) {
          return <Spinner message="Loading..." size="large" />;
        }
        if (error) {
          return <Error error={error} />;
        }

        return (
          <div className="App">
            {!data.getMyProfile.desires.length && <p>No Desires</p>}
            <h2>{data.getMyProfile.profilename}</h2>
            {data.getMyProfile.desires.map(desire => {
              return <div>{desire}</div>;
            })}
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(MyProfileInfo);
