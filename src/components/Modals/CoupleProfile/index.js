import React, { PureComponent } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withTranslation } from "react-i18next";
import {
  LINK_PROFILE,
  GET_SETTINGS,
  GENERATE_CODE,
  UNLINK_PROFILE
} from "../../../queries";
import { Mutation, Query } from "react-apollo";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Modal from "../../common/Modal";
import "./CoupleProfile.css";
import CoupleProfileImage from "../../../assets/img/elements/couple-profile.png";

class CoupleProfile extends PureComponent {
  state = { cfmDlgOpen: false, code: "", toLink: false };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleTextChange = code => {
    if (this.mounted) {
      this.setState({ code });
    }
  };

  toggleDlg = toLink => {
    this.setState({ cfmDlgOpen: !this.state.cfmDlgOpen, toLink });
  };

  handleLink = (linkProfile, close) => {
    if (this.state.code !== "" && this.state.toLink) {
      linkProfile()
        .then(({ data }) => {
          close();
          window.location.reload();
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    } else {
      close();
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

  showDeleteConfirm(close, username) {
    const { t, tReady } = this.props;

    return (
      <Mutation mutation={UNLINK_PROFILE}>
        {(unlinkProfile, { loading }) => {
          if (loading || !tReady) {
            return null;
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
    const { close, t, tReady, setValue, ErrorHandler, username } = this.props;
    if (!tReady) {
      return null;
    }
    const { cfmDlgOpen, code, toLink } = this.state;
    if (username) {
      return this.showDeleteConfirm(close, username, setValue);
    }

    return (
      <>
        <Modal close={close} fullWidth className="couples" noBorder noHeader>
          <div className="couple-profile">
            <div className="vanish-scroll" style={{ backgroundColor: "#fff" }}>
              {t("scroll")}
            </div>
            <div className="profile-top">
              <h3 className="title">Couple's Profile</h3>
              <h4 className="title-small">Stray Together</h4>
            </div>
            <div className="profile-bottom">
              <div className="layer-left">
                <img src={CoupleProfileImage} alt="" />
                <p className="content">
                  Couple's Profiles are profiles shared by 2 people.
                  <br />
                  All communications are accessible by both members.
                </p>
                <hr className="line" />
              </div>
              <div className="layer-right">
                <h4 className="question-first">
                  Did you recieve a Couple's Code?
                </h4>
                <p className="require">
                  Add your Couple's Code here and click Submit!
                </p>
                <div className="code-input-wrapper">
                  <input
                    type="text"
                    required
                    id="couples_code"
                    onChange={e => this.handleTextChange(e.target.value)}
                    value={code}
                  />
                  <span
                    className="submitCpl"
                    onClick={() => this.toggleDlg(true)}
                  >
                    Submit
                  </span>
                </div>
                <hr className="line" />
                <h4 className="question-second">
                  Want to create a Couple's Profile?
                </h4>
                <p className="require-code">
                  Send this Couple's Code to your pantner
                </p>
                <Query query={GENERATE_CODE} fetchPolicy="cache-first">
                  {({ data, loading, error }) => {
                    if (loading) {
                      return (
                        <div className="Couple-code">
                          <div className="content-code">Loading...</div>
                        </div>
                      );
                    }
                    if (error) {
                      return (
                        <ErrorHandler.report
                          error={error}
                          calledName={"codeBox"}
                        />
                      );
                    }
                    if (!data.generateCode) {
                      return <div>{t("common:error")}</div>;
                    }
                    const cplCode = data.generateCode;
                    return (
                      <CopyToClipboard text={cplCode}>
                        <div
                          className="Couple-code"
                          onClick={() => this.toggleDlg(false)}
                        >
                          <div className="content-code">{cplCode}</div>
                        </div>
                      </CopyToClipboard>
                    );
                  }}
                </Query>
              </div>
            </div>
          </div>
        </Modal>
        <Dialog
          onClose={this.toggleDlg}
          aria-labelledby="Image"
          open={cfmDlgOpen}
        >
          <DialogTitle id="alert-dialog-title">
            Include Messages and Events
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {!toLink && (
                <>
                  Couples Code has been copied to your clipboard. Share this
                  with your partner to create a Couples Profile.
                  <br />
                  <br />
                </>
              )}

              {t("includemsg")}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Mutation
              mutation={LINK_PROFILE}
              refetchQueries={[{ query: GET_SETTINGS }]}
              variables={{
                code
              }}
            >
              {linkProfile => (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setValue({
                        name: "includeMsgs",
                        value: true
                      });
                      this.handleLink(linkProfile, close);
                    }}
                  >
                    Include
                  </Button>
                  {"  "}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setValue({
                        name: "includeMsgs",
                        value: false
                      });
                      this.handleLink(linkProfile, close);
                    }}
                  >
                    DO NOT Include
                  </Button>
                </>
              )}
            </Mutation>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withTranslation("modals")(CoupleProfile);
