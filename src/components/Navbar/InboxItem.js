import React from "react";
import { NavLink } from "react-router-dom";

const InboxItem = () => {
  return (
    <div className="inbox hidden-mobile">
      <NavLink to="/inbox">
        <span className="icon mail">
          <span className="count">2</span>
        </span>
      </NavLink>
    </div>
  );
};

export default InboxItem;
