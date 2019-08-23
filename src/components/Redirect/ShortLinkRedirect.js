import React from "react";
import { Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_FULL_LINK } from "../../queries";
import Spinner from "../common/Spinner";

const ShortLinkRedirect = props => {
  const hash = props.hash;
  return (
    <Query
      query={GET_FULL_LINK}
      variables={{ shortenedUrl: hash }}
      fetchPolicy="cache-first"
    >
      {({ data, loading, error }) => {
        if (loading) {
          return <Spinner size="large" />;
        }
        if (error) {
          return <div>Url is invalid</div>;
        }
        if (!data.getFullLink) {
          return <div>Url is invalid</div>;
        }

        return <Redirect to={"?" + data.getFullLink} />;
      }}
    </Query>
  );
};

export default ShortLinkRedirect;
