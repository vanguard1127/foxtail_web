import React from "react";
const InboxSearchTextBox = ({ t, handleSearchTextChange }) => (
  <div className="search">
    <input
      type="text"
      placeholder={t("search") + "..."}
      onChange={handleSearchTextChange}
    />
  </div>
);

export default InboxSearchTextBox;
