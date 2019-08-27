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
        style={{ fontSize: "20px", paddingBottom: "35px" }}
      >
        Daily like limit reached. Please come back tomorrow. Or become a Black
        Member and have unlimited likes
      </span>
    </Modal>
  );
};

export default withTranslation("modals")(DailyLimitModal);
