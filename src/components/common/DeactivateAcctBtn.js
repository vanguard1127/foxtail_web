import React, { PureComponent } from "react";
import { DELETE_USER } from "../../queries";
import { Mutation } from "react-apollo";
import { ApolloConsumer } from "react-apollo";
import ContactUsModal from "../Modals/ContactUs";

class DeactivateAcctBtn extends PureComponent {
  state = { showContactModal: false };
  handleSubmit = ({ client, deleteUser }) => {
    const { t, history } = this.props;
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
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };
  toggleContactModal = () => {
    this.setState({ showContactModal: !this.state.showContactModal });
  };
  render() {
    const { t } = this.props;
    const { showContactModal } = this.state;
    return (
      <div className="content deactivate">
        <div className="row">
          <Mutation mutation={DELETE_USER}>
            {deleteUser => {
              return (
                <ApolloConsumer>
                  {client => {
                    return (
                      <>
                        <span onClick={this.toggleContactModal}>
                          {t("common:deactacct")}
                        </span>
                        {showContactModal && (
                          <ContactUsModal
                            close={this.toggleContactModal}
                            isDelete={true}
                            callback={() =>
                              this.handleSubmit({
                                client,
                                deleteUser
                              })
                            }
                            header={t("common:Why are you leaving?")}
                            description={t(
                              "common:Let us know what we can do to improve"
                            )}
                            cancelText={t(
                              "common:Send Complaint & Keep Profile"
                            )}
                            okText={t("common:Delete My Profile")}
                          />
                        )}
                      </>
                    );
                  }}
                </ApolloConsumer>
              );
            }}
          </Mutation>
        </div>
      </div>
    );
  }
}

export default DeactivateAcctBtn;
