import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { UNLINK_PROFILE } from "../../../queries";
import { Mutation } from "react-apollo";
import Spinner from "../../common/Spinner";
import LinkBox from "./LinkBox";
import Modal from "../../common/Modal";
import IncludeMsgSlide from "./IncludeMsgSlide";
import CodeBox from "./CodeBox";
class Couples extends Component {
  state = {
    code: "",
    currSlide: 1
  };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.code !== nextState.code ||
      this.state.currSlide !== nextState.currSlide ||
      this.props.includeMsgs !== nextProps.includeMsgs ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  handleTextChange = code => {
    if (this.mounted) {
      this.setState({ code });
    }
  };

  handleLink = (linkProfile, close) => {
    if (this.state.code !== "") {
      linkProfile()
        .then(({ data }) => {
          close();
          window.location.reload();
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    }
  };

  next = () => {
    if (this.mounted) {
      this.setState({ currSlide: 2 });
    }
  };

  prev = () => {
    if (this.mounted) {
      this.setState({ currSlide: 1 });
    }
  };

  handleUnLink = async (unlinkProfile, close) => {
    await unlinkProfile()
      .then(({ data }) => {
        //switch to new screen for do u want to edit?
        close();
        window.location.reload();
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  showLinkModal(close, code, setValue, includeMsgs) {
    const { currSlide } = this.state;
    const {
      t,
      ErrorHandler: { ErrorBoundary }
    } = this.props;
    return (
      <Modal close={close} className="couples">
        <section className="couple-popup-content">
          <div className="container">
            <div className="col-md-12">
              <div className="form">
                {currSlide === 1 && (
                  <div className="content">
                    <div className="couple-cover" />
                    <span className="description">{t("cplProfileDesc")}</span>
                    <ErrorBoundary>
                      <LinkBox
                        code={code}
                        handleTextChange={this.handleTextChange}
                        next={this.next}
                        t={t}
                      />
                    </ErrorBoundary>

                    <ErrorBoundary>
                      <CodeBox
                        includeMsgs={includeMsgs}
                        setValue={setValue}
                        t={t}
                      />{" "}
                    </ErrorBoundary>
                  </div>
                )}
                {currSlide === 2 && (
                  <ErrorBoundary>
                    {" "}
                    <IncludeMsgSlide
                      prev={this.prev}
                      close={close}
                      includeMsgs={includeMsgs}
                      code={code}
                      setValue={setValue}
                      handleLink={this.handleLink}
                      t={t}
                    />{" "}
                  </ErrorBoundary>
                )}
              </div>
            </div>
          </div>
        </section>
      </Modal>
    );
  }

  toggleDialog = () => {
    this.props.ErrorHandler.setBreadcrumb("Dialog Modal Toggled:");
    this.setState({ showModal: !this.state.showModal });
  };

  showDeleteConfirm(close, username) {
    const { t, tReady } = this.props;

    return (
      <Mutation mutation={UNLINK_PROFILE}>
        {(unlinkProfile, { loading }) => {
          if (loading || !tReady) {
            return (
              <Modal close={close}>
                <Spinner />
              </Modal>
            );
          }
          return (
            <Modal
              header={t("removelinkto") + " " + username + "?"}
              close={close}
              description={t("coupdeact")}
              okSpan={
                <span
                  className="color"
                  onClick={() => this.handleUnLink(unlinkProfile, close)}
                >
                  Yes
                </span>
              }
            />
          );
        }}
      </Mutation>
    );
  }

  render() {
    const { close, username, setValue, includeMsgs } = this.props;
    const { code } = this.state;
    if (username) {
      return this.showDeleteConfirm(close, username, setValue);
    }
    return this.showLinkModal(close, code, setValue, includeMsgs);
  }
}

export default withTranslation("modals")(Couples);
