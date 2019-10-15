import React from "react";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";

const DailyLimitModal = ({ t, close, history }) => {
  return (
    <Modal
      header={t("dailylimit")}
      close={() => close()}
      okSpan={
        <span
          className="color"
          onClick={async () =>
            history.push({
              state: { showBlkMdl: true },
              pathname: "/settings"
            })
          }
        >
          {t("upgradeblk")}
        </span>
      }
    >
      <span
        className="description"
        style={{ fontSize: "16px", paddingBottom: "35px", lineHeight: "24px" }}
      >
        {t("plscomeback")}...
        <br />
        <b>{t("becomeblkulm")}</b>
      </span>
    </Modal>
  );
};

export default withTranslation("modals")(DailyLimitModal);
