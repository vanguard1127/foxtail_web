import React from "react";
import { Redirect } from "react-router-dom";
import { Query } from "react-apollo";

import { GET_FULL_LINK } from "../../queries";

import Spinner from "../common/Spinner";

const ShortLinkRedirect = ({ hash }) => {
  console.log("getting /dev route");
  return (
    <Query
      query={GET_FULL_LINK}
      variables={{ shortenedUrl: hash }}
      fetchPolicy="cache-first"
    >
      {({ data, loading, error }) => {
        if (loading) {
          return <Spinner size="large" />;
        } else if (error || !data.getFullLink) {
          return <div>Url is invalid</div>;
        } else {
          return <Redirect to={"?" + data.getFullLink} />;
        }
      }}
    </Query>
  );
};

export default ShortLinkRedirect;
