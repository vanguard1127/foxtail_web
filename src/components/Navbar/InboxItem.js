import React from "react";
import { NavLink } from "react-router-dom";

const InboxItem = ({ count }) => {
  return (
    <div
      className={count > 0 ? "inbox new hidden-mobile" : "inbox hidden-mobile"}
    >
      <NavLink to="/inbox">
        <span className="icon mail">
          <span className="count">{count}</span>
        </span>
      </NavLink>
    </div>
  );
};

export default InboxItem;
