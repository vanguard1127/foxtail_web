import React, { PureComponent } from "react";
import CreateSubBtn from "./CreateSubBtn";
import Modal from "../../common/Modal";
import { withNamespaces } from "react-i18next";

class Black extends PureComponent {
  state = { token: "", ccLast4: "" };

  render() {
    const { close, t, ErrorHandler, notifyClient } = this.props;
    return (
      <Modal
        close={close}
        description="Get more of what you love ❤️️"
        okSpan={
          <CreateSubBtn
            close={close}
            t={t}
            ErrorHandler={ErrorHandler}
            notifyClient={notifyClient}
          />
        }
      >
        {" "}
        <ErrorHandler.ErrorBoundary>
          <>
            <div className="blackmember-cover" />
            <h3 className="black-head">BLACK Member privledges include:</h3>
            <ul className="black-member">
              <li>Direct Chat to Users (no match needed)</li>
              <li>Change Location of your profile</li>
              <li>Only Be Seen By Members You Like</li>
              <li>Hide your online status</li>
              <li>Show higher in results!</li>
            </ul>
          </>
        </ErrorHandler.ErrorBoundary>
      </Modal>
    );
  }
}
export default withNamespaces("modals")(Black);
