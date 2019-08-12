import React, { Component } from "react";
import axios from "axios";
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
import Tooltip from "../../common/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Modal from "../../common/Modal";
import Spinner from "../../common/Spinner";
import { withTranslation } from "react-i18next";

import LinkIcon from "@material-ui/icons/Link";

class Share extends Component {
  referUrl = "";
  state = {
    copied: false
  };

  async componentDidMount() {
    const { userID, profile, event } = this.props;
    let url;
    if (profile) {
      url = `${process.env.REACT_APP_CLIENT_URL}?refer=${userID}&mem=${profile.id}`;
    } else if (event) {
      url = `${process.env.REACT_APP_CLIENT_URL}?refer=${userID}&eve=${event.id}`;
    } else {
      url = `${process.env.REACT_APP_CLIENT_URL}?refer=${userID}`;
    }

    this.referUrl = await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/lnk`, {
        url
      })
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
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
    const { profile, event, close, t, ErrorBoundary, tReady } = this.props;
    const { copied } = this.state;

    if (!tReady) {
      return (
        <Modal close={close}>
          <Spinner />
        </Modal>
      );
    }

    let title = "";
    const body = (profile, event, t) => {
      if (profile) {
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
        title = t("invitation") + " " + event.eventname;
        return <div>{t("shareevent")}?</div>;
      } else {
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
              <FacebookShareButton url={this.referUrl} quote={title}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={this.referUrl} title={title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <RedditShareButton
                url={this.referUrl}
                title={title}
                windowWidth={660}
                windowHeight={460}
              >
                <RedditIcon size={32} round />
              </RedditShareButton>
              <TumblrShareButton
                url={this.referUrl}
                title={title}
                windowWidth={660}
                windowHeight={460}
              >
                <TumblrIcon size={32} round />
              </TumblrShareButton>
              <CopyToClipboard text={this.referUrl}>
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
                url={this.referUrl}
                subject={title}
                body={title + "." + t("checkout") + ":" + this.referUrl}
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
