import React from "react";
import { NavLink } from "react-router-dom";

const InboxItem = ({ count, active }) => {
  let iconstyle = "inbox hidden-mobile";
  if (count > 0) {
    iconstyle += " new";
  }
  if (active) {
    iconstyle += " active";
  }

  return (
    <div className={iconstyle}>
      <NavLink to="/inbox">
        <span className="icon mail">
          <span className="count">{count}</span>
        </span>
        <span className="text">Inbox</span>
      </NavLink>
    </div>
  );
};

export default InboxItem;
