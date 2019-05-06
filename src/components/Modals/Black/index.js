import React, { PureComponent } from "react";
import CreateSubBtn from "./CreateSubBtn";
import Modal from "../../common/Modal";
import { withNamespaces } from "react-i18next";

class Black extends PureComponent {
  state = { token: "", ccLast4: "" };

  render() {
    const { close, t, ErrorHandler, notifyClient, lang } = this.props;

    return (
      <Modal
        close={close}
        description={t("getmore")}
        okSpan={
          <CreateSubBtn
            close={close}
            t={t}
            ErrorHandler={ErrorHandler}
            notifyClient={notifyClient}
            lang={lang}
          />
        }
      >
        {" "}
        <ErrorHandler.ErrorBoundary>
          <>
            <div className="blackmember-cover" />
            <h3 className="black-head">{t("blkinclude")}</h3>
            <ul className="black-member">
              <li>{t("direct")}</li>
              <li>{t("changeloc")}</li>
              <li>{t("onlyliked")}</li>
              <li>{t("hidestat")}</li>
              <li>{t("higher")}</li>
            </ul>
          </>
        </ErrorHandler.ErrorBoundary>
      </Modal>
    );
  }
}
export default withNamespaces("modals")(Black);
