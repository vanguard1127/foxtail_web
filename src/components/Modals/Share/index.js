import React, { Component } from "react";
import {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  RedditIcon,
  TumblrIcon,
  EmailIcon
} from "react-share";
import Modal from "../../common/Modal";
import { withNamespaces } from "react-i18next";

class Share extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { profile, event, close, t, ErrorBoundary } = this.props;
    let shareUrl = "";
    let title = "";
    const body = (profile, event, t) => {
      if (profile) {
        shareUrl = "http://localhost:3000/member/" + profile.id;
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
        shareUrl = "http://localhost:3000/event/" + event.id;
        title = t("invitation") + " " + event.eventname;
        return <div>{t("shareevent")}?</div>;
      } else {
        return null;
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
                width: "20vw"
              }}
            >
              <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <GooglePlusShareButton url={shareUrl}>
                <GooglePlusIcon size={32} round />
              </GooglePlusShareButton>
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

export default withNamespaces("modals")(Share);
