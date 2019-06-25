import React from "react";

import { Query } from "react-apollo";

import { GET_CURRENT_USER } from "../../queries";
import { toast } from "react-toastify";

const withSession = Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({ data, loading, refetch }) => {
      if (loading) {
        return null;
      }

      if (data.currentuser.announcement !== null) {
        toast();
        if (!toast.isActive("announce")) {
          toast.info(data.currentuser.announcement, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: false,
            toastId: "announce"
          });
        }
      }
      return <Component {...props} refetch={refetch} session={data} />;
    }}
  </Query>
);

export default withSession;
