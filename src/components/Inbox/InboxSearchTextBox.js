import React from "react";
const InboxSearchTextBox = ({ t }) => {
  return (
    <div className="search">
      <input type="text" placeholder={t("search") + "..."} />
    </div>
  );
};

export default InboxSearchTextBox;
