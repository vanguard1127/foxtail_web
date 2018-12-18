import React, { Component } from "react";
import { Modal } from "antd";
import CreateSubBtn from "../common/CreateSubBtn";
import { withNamespaces } from "react-i18next";

class BlackMemberModal extends Component {
  state = { token: "", ccLast4: "" };

  render() {
    const { visible, close, t } = this.props;
    return (
      <Modal
        title={"Become a Black Member"}
        centered
        visible={visible}
        footer={[]}
        onCancel={close}
        destroyOnClose
      >
        <img
          alt="upload"
          style={{ width: "100%" }}
          src={require("../../images/girl2.jpg")}
        />
        <div>
          <h3>{t("BLACK Member privledges include")}:</h3>
          <ul>
            <li>{t("Direct Chat to Users (no match needed)")}</li>
            <li>{t("Change Location of your profile")}</li>
            <li>{t("Only Be Seen By Members You Like")}</li>
            <li>{t("Hide your online and read status")}</li>
            <li>{t("Exclusive Black members by only search filter")}</li>
            <li>{t("Show higher in results")}</li>
            <li>
              {t(
                "Block current and future members by phone number and email (Invisible from people you know)"
              )}
            </li>
          </ul>
        </div>
        <CreateSubBtn
          refetchUser={this.props.refetchUser}
          close={this.props.close}
        />
      </Modal>
    );
  }
}

export default withNamespaces()(BlackMemberModal);
