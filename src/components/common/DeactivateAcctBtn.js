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
      <div className="content">
        <div className="row">
          <Mutation mutation={DELETE_USER}>
            {deleteUser => {
              return (
                <ApolloConsumer>
                  {client => {
                    return (
                      <>
                        <button onClick={() => this.toggleContactModal()}>
                          {t("common:deactacct")}
                        </button>
                        {showContactModal && (
                          <ContactUsModal
                            close={() => this.toggleContactModal()}
                            isDelete={true}
                            callback={() =>
                              this.handleSubmit({
                                client,
                                deleteUser
                              })
                            }
                            header="Why are you leaving?"
                            description="Let us know what we can do to improve"
                            cancelText="Send Complaint & Keep Profile"
                            okText="Delete My Profile"
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
