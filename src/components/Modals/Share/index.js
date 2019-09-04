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
import { Query } from "react-apollo";
import { SET_FULL_LINK } from "../../../queries";
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

    let url;
    if (profile) {
      url = `refer=${userID}&mem=${profile.id}`;
    } else if (event) {
      url = `refer=${userID}&eve=${event.id}`;
    } else {
      url = `refer=${userID}`;
    }
    const { copied } = this.state;

    if (!tReady) {
      return null;
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
            return <div>An Error has Occured</div>;
          }

          let refUrl = `${
            process.env.NODE_ENV === "development"
              ? "http:localhost:3000"
              : process.env.REACT_APP_CLIENT_URL
          }/${data.setFullLink}`;
          return (
            <Modal header={modalBody} close={close}>
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
                    <FacebookShareButton url={refUrl} quote={title}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={refUrl} title={title}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <RedditShareButton
                      url={refUrl}
                      title={title}
                      windowWidth={660}
                      windowHeight={460}
                    >
                      <RedditIcon size={32} round />
                    </RedditShareButton>
                    <TumblrShareButton
                      url={refUrl}
                      title={title}
                      windowWidth={660}
                      windowHeight={460}
                    >
                      <TumblrIcon size={32} round />
                    </TumblrShareButton>
                    <CopyToClipboard text={refUrl}>
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
                          style={{
                            width: "32px",
                            height: "32px",
                            cursor: "pointer"
                          }}
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
                      url={refUrl}
                      subject={title}
                      body={title + "." + t("checkout") + ":" + refUrl}
                    >
                      <EmailIcon size={32} round />
                    </EmailShareButton>
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
