import React, { Component } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditIcon,
  TumblrIcon,
  EmailIcon
} from "react-share";
import Tooltip from "@material-ui/core/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Modal from "../../common/Modal";
import Spinner from "../../common/Spinner";
import { withTranslation } from "react-i18next";

import LinkIcon from "@material-ui/icons/Link";

class Share extends Component {
  state = {
    copied: false
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.t !== nextProps.t ||
      this.state.copied !== nextState.copied ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  toggleCopied = val => {
    this.setState({ copied: val });
  };

  render() {
    const {
      userID,
      profile,
      event,
      close,
      t,
      ErrorBoundary,
      tReady
    } = this.props;
    const { copied } = this.state;

    if (!tReady) {
      return (
        <Modal close={close}>
          <Spinner />
        </Modal>
      );
    }
    let shareUrl = "";
    let title = "";
    const body = (profile, event, t) => {
      if (profile) {
        shareUrl =
          process.env.NODE_ENV === "production"
            ? "https://foxtailapp.com?refer=" + userID + "&mem=" + profile.id
            : "http://localhost:3000?refer=" + userID + "&mem=" + profile.id;
        title = t("intrstmsg") + ":";
        return (
          <div>
            {t("meetques")}{" "}
            {profile.users.map((user, index) => {
              if (index === 0) return user.username;
              else return +" & " + user.username;
            })}
            ?
          </div>
        );
      } else if (event) {
        shareUrl =
          process.env.NODE_ENV === "production"
            ? "https://foxtailapp.com?refer=" + userID + "&eve=" + event.id
            : "http://localhost:3000?refer=" + userID + "&eve=" + event.id;
        title = t("invitation") + " " + event.eventname;
        return <div>{t("shareevent")}?</div>;
      } else {
        shareUrl =
          process.env.NODE_ENV === "production"
            ? "https://foxtailapp.com?refer=" + userID
            : "http://localhost:3000?refer=" + userID;
        title = t(
          "Check out Foxtail. It's Sexy, Safe, Fun Dating. And it's FREE:"
        );
        return (
          <div>
            {t("Share Foxtail")} <br />
            <small>&quot;{t("thank you")}&quot;</small>
          </div>
        );
      }
    };
    const modalBody = body(profile, event, t);

    return (
      <Modal header={modalBody} close={close}>
        {" "}
        <ErrorBoundary>
          <div
            style={{
              justifyContent: "center",
              display: "flex"
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
              <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <RedditShareButton
                url={shareUrl}
                title={title}
                windowWidth={660}
                windowHeight={460}
              >
                <RedditIcon size={32} round />
              </RedditShareButton>
              <TumblrShareButton
                url={shareUrl}
                title={title}
                windowWidth={660}
                windowHeight={460}
              >
                <TumblrIcon size={32} round />
              </TumblrShareButton>
              <CopyToClipboard text={shareUrl}>
                <Tooltip
                  title={
                    copied
                      ? t("Copied url to clipboard")
                      : t("Copy referral url")
                  }
                  placement="top"
                  onClick={() => this.toggleCopied(true)}
                  onClose={() => this.toggleCopied(false)}
                >
                  <span
                    style={{ width: "32px", height: "32px", cursor: "pointer" }}
                    className="copyIcon"
                  >
                    <svg viewBox="0 0 64 64" width="32" height="32">
                      <g>
                        <circle cx="32" cy="32" r="31" fill="#FF8749" />{" "}
                        <LinkIcon className="linksvg" />
                      </g>
                    </svg>
                  </span>
                </Tooltip>
              </CopyToClipboard>
              <EmailShareButton
                url={shareUrl}
                subject={title}
                body={title + "." + t("checkout") + ":" + shareUrl}
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
          </div>
        </ErrorBoundary>
      </Modal>
    );
  }
}

export default withTranslation("modals")(Share);
