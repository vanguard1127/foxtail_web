import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { withApollo } from "react-apollo";

import deleteFromCache from "utils/deleteFromCache";
import { GET_COUNTS } from "queries";

interface IInboxItemProps {
  t: any;
  count: number;
  blinkInbox: boolean;
  client: any;
}

const InboxItem: React.FC<IInboxItemProps> = ({ t, count, blinkInbox, client }) => {
  useEffect(() => {
    return () => {
      const { cache } = client;
      deleteFromCache({ cache, query: "getInbox" });
      const { getCounts } = cache.readQuery({
        query: GET_COUNTS
      });
      let newCounts = { ...getCounts };
      newCounts.newMsg = false;
      cache.writeQuery({
        query: GET_COUNTS,
        data: {
          getCounts: { ...newCounts }
        }
      });
    }
  }, []);

  return (
    <NavLink to="/inbox">
      <div className={`inbox hidden-mobile${count > 0 ? ' new' : ''}`} role="heading" aria-level={1}>
        <span className={blinkInbox ? "icon mail blink" : "icon mail"}>
          <span className="count">{count}</span>
        </span>
        <span className="text">{t("common:Inbox")}</span>
      </div>
    </NavLink>
  );
}

export default withApollo(InboxItem);
