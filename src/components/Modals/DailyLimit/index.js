import React from "react";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";

const DailyLimitModal = ({ t, close, history }) => {
  return (
    <Modal
      header={"Daily Like Limit Reached"}
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
          UPGRADE TO BLACK
        </span>
      }
    >
      <span
        className="description"
        style={{ fontSize: "16px", paddingBottom: "35px", lineHeight: "24px" }}
      >
        Please come back tomorrow or...
        <br />
        <b>Become a Black Member and have UNLIMITED Likes!</b>
      </span>
    </Modal>
  );
};

export default withTranslation("modals")(DailyLimitModal);
