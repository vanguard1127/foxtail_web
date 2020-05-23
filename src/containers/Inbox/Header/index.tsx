import React, { memo } from "react";
import { WithT } from "i18next";

import "assets/css/breadcrumb.css";

interface IInboxHeaderPops extends WithT {
  chatOpen: boolean,
  closeChat: () => void,
  toggleRuleModal: () => void,
}

const InboxHeader: React.FC<IInboxHeaderPops> = memo(({
  chatOpen,
  closeChat,
  toggleRuleModal,
  t,
}) => {
  return (
    <section className="breadcrumb">
      <div className="container">
        <div className="col-md-12">
          <span
            className={chatOpen ? "head back" : "head"}
            onClick={closeChat}
          >
            {t("common:Inbox")}
          </span>
          <span className="title">
            {t("subtitle")}{" "}
            <span onClick={toggleRuleModal} className="link">
              {t("rules")}
            </span>
              .
            </span>
        </div>
      </div>
    </section>
  );
});

export default InboxHeader;
