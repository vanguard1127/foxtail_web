import React, { PureComponent } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withTranslation } from "react-i18next";
import {
  LINK_PROFILE,
  GET_SETTINGS,
  GENERATE_CODE,
  UNLINK_PROFILE
} from "../../../queries";
import { toast } from "react-toastify";
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
          window.location.reload(false);
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    } else {
      if (!toast.isActive("sharewith")) {
        toast(this.props.t("sharewith"), {
          toastId: "sharewith"
        });
      }
      close();
    }
  };

  handleUnLink = async (unlinkProfile, close) => {
    await unlinkProfile()
      .then(({ data }) => {
        //switch to new screen for do u want to edit?
        close();
        window.location.reload(false);
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
                  {t("common:Yes")}
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
    const { cfmDlgOpen, code } = this.state;
    if (username) {
      return this.showDeleteConfirm(close, username, setValue);
    }

    return (
      <>
        <Modal close={close} fullWidth className="couples" noHeader>
          <div className="couple-profile">
            <div className="vanish-scroll" style={{ backgroundColor: "#fff" }}>
              {t("scroll")}
            </div>
            <div className="profile-top">
              <h3 className="title">{t("common:cplpros")}</h3>
              <h4 className="title-small">{t("common:stray")}</h4>
            </div>
            <div className="profile-bottom">
              <div className="layer-left">
                <img src={CoupleProfileImage} alt="" />
                <p className="content">
                  {t("cplProfileDesc")}
                  <br />
                  {t("cplProfileDesc2")}
                </p>
                <hr className="line" />
              </div>
              <div className="layer-right">
                <h4 className="question-first">{t("coderecv")}</h4>
                <p className="require">{t("addcode")}</p>
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
                    {t("common:Submit")}
                  </span>
                </div>
                <hr className="line" />
                <h4 className="question-second">{t("createcoup")}</h4>
                <p className="require-code">{t("sendcode")}</p>
                <Query query={GENERATE_CODE} fetchPolicy="cache-first">
                  {({ data, loading, error }) => {
                    if (loading) {
                      return (
                        <div className="Couple-code">
                          <div className="content-code">
                            {t("common:Loading")}...
                          </div>
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
          open={cfmDlgOpen}
          style={{ zIndex: "999999999999999" }}
        >
          <DialogTitle id="alert-dialog-title">{t("includemsg")}</DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("includemsgdesc")}
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
                    {t("common:Include")}
                  </Button>
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
                    {t("common:NotInclude")}
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
