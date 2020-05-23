import React from "react";
import { WithT } from "i18next";

interface IInboxSearchTextBox extends WithT {
  handleSearchTextChange: (e: any) => void;
}

const InboxSearchTextBox: React.FC<IInboxSearchTextBox> = ({
  handleSearchTextChange,
  t,
}) => (
    <div className="search">
      <input
        type="text"
        placeholder={t("search") + "..."}
        onChange={handleSearchTextChange}
      />
    </div>
  );

export default InboxSearchTextBox;
