import React, { Component } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditIcon,
  EmailIcon
} from "react-share";
import { Query } from "react-apollo";
import { SET_FULL_LINK } from "../../../queries";
import copyToClipboard from "../../../utils/copyToClipboard";
import Modal from "../../common/Modal";
import { withTranslation } from "react-i18next";
import LinkIcon from "@material-ui/icons/Link";
import { toast } from "react-toastify";

class Share extends Component {
  refUrl = "";

  shouldComponentUpdate(nextProps) {
    if (
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  copy = () => {
    copyToClipboard(this.refUrl, this.showCopied);
  };

  showCopied = () => {
    if (!toast.isActive("copied")) {
      toast(this.props.t("Link copied to clipboard"), {
        toastId: "copied"
      });
    }
  };

  render() {
    const {
      userID,
      profile,
      profileID,
      event,
      close,
      t,
      ErrorBoundary,
      tReady
    } = this.props;

    let url;
    if (profile) {
      url = `refer=${userID}&mem=${profile.id}`;
    } else if (event) {
      url = `refer=${userID}&eve=${event.id}`;
    } else if (profileID) {
      url = `refer=${userID}&mem=${profileID}`;
    } else {
      url = `refer=${userID}`;
    }

    if (!tReady) {
      return null;
    }

    let title = "";
    let body = "";
    const mdlbody = (profile, event, t) => {
      if (profile) {
        const name = profile.users.reduce((result, user, index) => {
          if (index === 0) {
            return result + user.username;
          } else {
            return result + " & " + user.username;
          }
        }, "");
        title = t("whatdoyou") + " Foxtail Member: " + name + "?" + "\n" + "\n";
        body = t("whatdoyou") + " " + name + "?" + "\n" + "\n";
        return <div>{t("meetques") + " " + name}?</div>;
      } else if (event) {
        title = t("invitation") + " " + event.eventname;
        body = t("invitation") + " " + event.eventname + ":\n" + "\n";
        return <div>{t("shareevent")}?</div>;
      } else if (profileID) {
        title = "Check out my profile on Foxtail profile." + "\n" + "\n";
        body = "Check out my profile on Foxtail profile." + "\n" + "\n";
        return <div>{t("shareprof")}</div>;
      } else {
        title = t("checkoutfox");
        body = t("checkoutfox");
        return (
          <div>
            {t("Share Foxtail")} <br />
            <small>&quot;{t("thank you")}&quot;</small>
          </div>
        );
      }
    };
    const modalBody = mdlbody(profile, event, t);

    return (
      <Query
        query={SET_FULL_LINK}
        variables={{ url }}
        fetchPolicy="cache-first"
      >
        {({ data, loading, error }) => {
          if (loading) {
            return null;
          }
          if (!data) {
            return <div>{t("error")}</div>;
          }

          this.refUrl = `${process.env.REACT_APP_CLIENT_URL}/${data.setFullLink}`;
          return (
            <Modal
              header={modalBody}
              close={close}
              description={t(
                "Share Foxtail and Get 1 week FREE Black Membership"
              )}
            >
              <ErrorBoundary>
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                      width: "100%"
                    }}
                  >
                    <FacebookShareButton url={this.refUrl} quote={body}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={this.refUrl} title={body}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <RedditShareButton
                      url={body + this.refUrl}
                      windowWidth={660}
                      windowHeight={460}
                    >
                      <RedditIcon size={32} round />
                    </RedditShareButton>
                    <div>
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          cursor: "pointer"
                        }}
                        className="copyIcon"
                        onClick={this.copy}
                      >
                        <svg viewBox="0 0 64 64" width="32" height="32">
                          <g>
                            <circle cx="32" cy="32" r="31" fill="#FF8749" />{" "}
                            <LinkIcon className="linksvg" />
                          </g>
                        </svg>
                      </span>
                    </div>
                    <EmailShareButton
                      url={this.refUrl}
                      subject={title}
                      body={body}
                      separator=" "
                    >
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                      width: "100%"
                    }}
                  >
                    {t(
                      "*Limited Time - Get $100 for referring 100 members. We'll email you when you reach 100 for payment info."
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            </Modal>
          );
        }}
      </Query>
    );
  }
}

export default withTranslation("modals")(Share);
