// TODO Move to Settings Container after refactor, as it is used only in Settings

import React, { memo, useState, Fragment } from "react";
import { Mutation } from "react-apollo";
import { ApolloConsumer } from "react-apollo";
import { WithT } from "i18next";

import * as ErrorHandler from 'components/common/ErrorHandler';
import { DELETE_USER } from "queries";

import ContactUsModal from "../Modals/ContactUs";

interface IDeactivateAcctBtnProps extends WithT {
  toggleSharePopup: (shareProfile: any) => void,
  history: any,
}

const DeactivateAcctBtn: React.FC<IDeactivateAcctBtnProps> = memo(({
  toggleSharePopup,
  history,
  t,
}) => {
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const handleSubmit = ({ client, deleteUser }) => {
    deleteUser()
      .then(({ data }) => {
        alert(t("common:acctdeleted") + ".");

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.clear();
        client.resetStore();

        history.push("/");
      })
      .catch(res => {
        ErrorHandler.catchErrors(res);
      });
  };

  const toggleContactModal = () => {
    setShowContactModal(!showContactModal);
  };

  return (
    <div className="content deactivate">
      <div className="row">
        <Mutation mutation={DELETE_USER}>
          {deleteUser => {
            return (
              <ApolloConsumer>
                {client => {
                  return (
                    <Fragment>
                      <span onClick={toggleContactModal}>
                        {t("common:deactacct")}
                      </span>
                      {showContactModal && (
                        <ContactUsModal
                          close={toggleContactModal}
                          isDelete={true}
                          callback={() =>
                            handleSubmit({
                              client,
                              deleteUser
                            })
                          }
                          header={t("common:Why are you leaving?")}
                          description={t("common:Let us know what we can do to improve")}
                          cancelText={t("common:Send Complaint & Keep Profile")}
                          okText={t("common:Delete My Profile")}
                          belowText={
                            <div style={{ textAlign: "center" }}>
                              No one near you? Consider{" "}
                              <span
                                className="bluelink"
                                onClick={toggleSharePopup}
                              >
                                Sharing
                                </span>{" "}
                                Foxtail instead.
                              </div>
                          }
                        />
                      )}
                    </Fragment>
                  );
                }}
              </ApolloConsumer>
            );
          }}
        </Mutation>
      </div>
    </div>
  );
});

export default DeactivateAcctBtn;
