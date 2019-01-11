import React from "react";
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

let shareUrl = "";
let title = "";

const body = (profile, event) => {
  if (profile) {
    shareUrl = "http://localhost:3000/members/" + profile.id;
    title =
      "Someone thinks you would be interested in a member on Foxtail. Here's their profile:";
    return (
      <div>
        Know someone that would like to meet{" "}
        {profile.users.map((user, index) => {
          if (index === 0) return user.username;
          else return +" & " + user.username;
        })}
        ?
      </div>
    );
  } else if (event) {
    shareUrl = "http://localhost:3000/events/" + event.id;
    title = "You have been invited to " + event.eventname;
    return <div>Share this Event?</div>;
  } else {
    return null;
  }
};

const Share = ({ profile, event, close }) => {
  const modalBody = body(profile, event);

  return (
    <section className="popup-content show">
      <div className="container">
        <div className="col-md-12">
          <div className="row">
            <div className="offset-md-3 col-md-6">
              <div className="modal-popup photo-verification">
                <div className="m-head">
                  <span className="heading">{modalBody}</span>
                  <span className="close" onClick={close} />
                </div>
                <div className="m-body">
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
                      <FacebookShareButton
                        url={shareUrl}
                        quote={title}
                        className="Demo__some-network__share-button"
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={shareUrl}
                        title={title}
                        className="Demo__some-network__share-button"
                      >
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                      <GooglePlusShareButton
                        url={shareUrl}
                        className="Demo__some-network__share-button"
                      >
                        <GooglePlusIcon size={32} round />
                      </GooglePlusShareButton>
                      <RedditShareButton
                        url={shareUrl}
                        title={title}
                        windowWidth={660}
                        windowHeight={460}
                        className="Demo__some-network__share-button"
                      >
                        <RedditIcon size={32} round />
                      </RedditShareButton>
                      <TumblrShareButton
                        url={shareUrl}
                        title={title}
                        windowWidth={660}
                        windowHeight={460}
                        className="Demo__some-network__share-button"
                      >
                        <TumblrIcon size={32} round />
                      </TumblrShareButton>
                      <EmailShareButton
                        url={shareUrl}
                        subject={title}
                        body={
                          title + ". Check out more details here:" + shareUrl
                        }
                        className="Demo__some-network__share-button"
                      >
                        <EmailIcon size={32} round />
                      </EmailShareButton>
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
};

export default Share;
