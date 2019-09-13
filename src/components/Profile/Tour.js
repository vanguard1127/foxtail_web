import React, { PureComponent, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { Mutation } from "react-apollo";
import { SEEN_TOUR } from "../../queries";
import CustomTour from "../common/CustomTour";
import { withRouter } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
class ProfileTour extends PureComponent {
  state = {
    isTourOpen: true
  };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  closeTour = seenTour => {
    seenTour()
      .then(({ data }) => {
        this.props.refetchUser();
        window.location.replace("/members");
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
    if (this.mounted) {
      this.setState({ isTourOpen: false });
    }
  };

  openTour = () => {
    if (this.mounted) {
      this.setState({ isTourOpen: true });
    }
  };

  render() {
    const { t } = this.props;
    const { isTourOpen } = this.state;

    let showDesire = '[data-tut="desires"]';
    if (window.innerWidth < 768) {
      showDesire = '[data-tut="desiresM"]';
    }

    const tourConfig = [
      {
        selector: '[data-tut="page"]',
        content: `Here you will find member info and images. Private images can only be seen after matching or chatting.`
      },
      {
        selector: showDesire,
        content: `Desires are simply this member's intrests and are NOT to be expected of them.`
      },
      {
        selector: '[data-tut="btns"]',
        content: `Use the Heart button to like the member. Or click Send a Message instantly (only BLACK members).`
      },
      {
        selector: '[data-tut="report"]',
        content: `If you feel something is not right about this member's profile or you never want to see them again, please click the flag to report or block this member.`
      },
      {
        selector: '[data-tut="na"]',
        content: `That's all for now. Have fun!`
      }
    ];

    return (
      <Fragment>
        <section className="profile">
          <div className="container" data-tut="page">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-3">
                  <div className="avatar-content">
                    <div className="avatar-card">
                      <div className="avatar">
                        <img
                          src={
                            process.env.REACT_APP_S3_TOUR_BUCKET_URL +
                            "usr/big-avatar/1011@2x.png"
                          }
                          alt=""
                        />
                      </div>
                      <div className="functions" data-tut="btns">
                        <div className="btn send-msg">Send Message</div>
                        <div className="btn heart" />
                      </div>
                    </div>
                  </div>
                  <div className="desires" data-tut="desires">
                    <div className="profile-head">Desires</div>
                    <ul>
                      <li>Cuddling</li>
                      <li>Dating</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="user-info online">
                    <div>
                      <span> Adriana, </span>
                      <span> 32, </span>
                      <span>Bisexual</span>
                    </div>
                  </div>
                  <div className="data-info">
                    <ul>
                      <li>
                        <span className="head">Gender:</span>
                        <span className="data">Female</span>
                      </li>
                      <li>
                        <span className="head">Distance:</span>
                        <span className="data">&lt; 1mi away</span>
                      </li>
                      <li>
                        <span className="head">Looking For:</span>
                        <span className="data">Male</span>
                      </li>
                      <li>
                        <span className="head">Last Login:</span>
                        <span className="data"> Online</span>
                      </li>
                    </ul>
                    <div className="functions">
                      <div className="share btn" />
                      <div className="report btn" />
                    </div>
                  </div>
                  <div className="user-bio">
                    <div className="profile-head">User Bio</div>
                    <p>
                      New here just looking to meet couples and singles. We can
                      see where it goes ;)
                    </p>
                  </div>
                  <div className="mobile desires" data-tut="desiresM">
                    <div className="profile-head">Desires</div>
                    <ul>
                      <li>cuddling</li>
                      <li>dating</li>
                    </ul>
                  </div>
                  <div className={"photos-slider public"}>
                    <div className="profile-head">{t("Public")} (1)</div>
                    <div id="lightgallery" ref={this.onLightGallery}>
                      <div className="item" key={Math.random()}>
                        <a href={"#link"}>
                          <img
                            src={
                              process.env.REACT_APP_S3_TOUR_BUCKET_URL +
                              "usr/medium-avatar/1001.png"
                            }
                            alt=""
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className={"photos-slider private"}>
                    <div className="profile-head">{t("Private")} (1)</div>
                    <div id="lightgallery" ref={this.onLightGallery}>
                      <div className="item" key={Math.random()}>
                        <a href={"#link"}>
                          <img
                            src={
                              process.env.REACT_APP_S3_TOUR_BUCKET_URL +
                              "usr/blur-avatar/1002.png"
                            }
                            alt=""
                          />
                        </a>
                      </div>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Mutation
          mutation={SEEN_TOUR}
          variables={{
            tour: "p"
          }}
        >
          {seenTour => {
            return (
              <div>
                <CustomTour
                  onTourClose={() => this.closeTour(seenTour)}
                  tourConfig={tourConfig}
                  isTourOpen={isTourOpen}
                />
              </div>
            );
          }}
        </Mutation>
      </Fragment>
    );
  }
}

export default withRouter(withTranslation("profile")(ProfileTour));
