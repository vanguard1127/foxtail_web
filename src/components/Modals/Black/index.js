import React, { PureComponent } from "react";
import CreateSubBtn from "./CreateSubBtn";
import Modal from "../../common/Modal";
import Spinner from "../../common/Spinner";
import { withTranslation } from "react-i18next";

class Black extends PureComponent {
  state = { token: "", ccLast4: "" };

  render() {
    const { close, t, ErrorHandler, notifyClient, lang, tReady } = this.props;
    if (!tReady) {
      return (
        <Modal close={close}>
          <Spinner />
        </Modal>
      );
    }
    return (
      <Modal
        close={close}
        description={t("getmore")}
        className="black"
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
              <li>{t("infinite")}</li>
            </ul>
          </>
        </ErrorHandler.ErrorBoundary>
      </Modal>
    );
  }
}
export default withTranslation("modals")(Black);
