import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { GENERATE_CODE, LINK_PROFILE, UNLINK_PROFILE } from "../../../queries";
import { Query, Mutation } from "react-apollo";
import { EmailShareButton, EmailIcon } from "react-share";
import Spinner from "../../common/Spinner";
import Header from "./Header";
import LinkBox from "./LinkBox";
import IncludeMsgSlide from "./IncludeMsgSlide";
import CodeBox from "./CodeBox";
class Couples extends Component {
  state = {
    code: "",
    currentSlide: 0,
    title: this.props.t("joinme"),
    shareUrl: "",
    currSlide: 1
  };

  handleTextChange = code => {
    this.setState({ code });
  };

  handleLink = (linkProfile, close) => {
    if (this.state.code !== "") {
      linkProfile()
        .then(({ data }) => {
          close();
          this.props.setPartnerID(data.linkProfile.partnerName);
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    }
  };

  next = () => {
    this.setState({ currSlide: 2 });
  };

  prev = () => {
    this.setState({ currSlide: 1 });
  };

  handleUnLink = async (unlinkProfile, close) => {
    await unlinkProfile()
      .then(({ data }) => {
        //switch to new screen for do u want to edit?
        close();
        this.props.setPartnerID("addpartner");
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  showLinkModal(visible, close, code, setValue, includeMsgs) {
    const { title, currSlide } = this.state;
    const { t } = this.props;
    return (
      <section className="couple-popup-content">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup">
                  <Header close={close} title={title} t={t} />
                  <div className="m-body">
                    <div className="page">
                      <div className="form">
                        {currSlide === 1 && (
                          <div className="content">
                            <LinkBox
                              code={code}
                              handleTextChange={this.handleTextChange}
                              next={this.next}
                              t={t}
                            />

                            <CodeBox
                              includeMsgs={includeMsgs}
                              setValue={setValue}
                              t={t}
                            />
                          </div>
                        )}
                        {currSlide === 2 && (
                          <IncludeMsgSlide
                            prev={this.prev}
                            close={close}
                            includeMsgs={includeMsgs}
                            code={code}
                            setValue={setValue}
                            handleLink={this.handleLink}
                            t={t}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  showDeleteConfirm(visible, close, username, unlinkProfile, setValue) {
    const { t } = this.props;
    return (
      <Mutation mutation={UNLINK_PROFILE}>
        {(unlinkProfile, { loading }) => {
          if (loading) {
            //TODO: nice unlinking message
            return <Spinner message={t("Unlinking") + "..."} size="large" />;
          }
          return (
            // <Modal
            //   title={"Want to remove your link to " + username + "?"}
            //   centered
            //   visible={visible}
            //   okType="danger"
            //   okText="Yes"
            //   onOk={() => this.handleUnLink(unlinkProfile, close)}
            //   onCancel={close}
            //   cancelText="No"
            // >
            <div>{t("coupdeact")}</div>
            // </Modal>
          );
        }}
      </Mutation>
    );
  }

  render() {
    const { visible, close, username, setValue, includeMsgs } = this.props;
    const { code } = this.state;
    if (username) {
      return this.showDeleteConfirm(visible, close, username, setValue);
    }
    return this.showLinkModal(visible, close, code, setValue, includeMsgs);
  }
}

export default withNamespaces()(Couples);
