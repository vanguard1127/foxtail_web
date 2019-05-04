import React, { PureComponent, Fragment } from "react";
import { withNamespaces } from "react-i18next";
import { Mutation } from "react-apollo";
import { SEEN_TOUR } from "../../queries";
import CustomTour from "../common/CustomTour";
import withAuth from "../HOCs/withAuth";
import { withRouter } from "react-router-dom";
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
        this.props.history.push("/events");
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

    let showinfo = '[data-tut="info"]';
    if (window.innerWidth < 768) {
      showinfo = '[data-tut="infoM"]';
    }

    const tourConfig = [
      {
        selector: '[data-tut="ok"]',
        content: `This event looks fun!`
      },
      {
        selector: '[data-tut="going"]',
        content: `You can see members attending here.`
      },
      {
        selector: showinfo,
        content: `Event info is here, but check back before going in case any details have changed.`
      },
      {
        selector: '[data-tut="discuss"]',
        content: `All event info should be on this page. If you need more info don't hesitate to post a comment after deciding you want to attend. *Only attendees can comment.`
      },
      {
        selector: '[data-tut="na"]',
        content: `Feel free to like and message members in an event before going. It's more fun that way.`
      }
    ];

    return (
      <Fragment>
        <section className="event-detail" data-tut="ok">
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="header">
                    <div className="date">
                      <span>22</span>
                      <span>Dec</span>
                      <span>20:00</span>
                    </div>
                    <div className="info">
                      <span className="event-name">
                        New Year Date Night @ Elixir Saloon
                      </span>
                      <span className="event-description">
                        It is a long established fact that a reader will be
                        distracted by the readable content of a page when
                        looking at its layout.{" "}
                      </span>
                      <div className="created">
                        <span className="avatar">
                          <a href="#">
                            <img
                              src="../assets/img/usr/medium-avatar/1003.png"
                              alt=""
                            />
                          </a>
                        </span>
                        <div className="detail">
                          <span className="name">
                            <a href="#">Barbara Cleiv</a>
                          </span>
                          <span className="created-date">
                            Created on December 12
                          </span>
                        </div>
                      </div>
                      <div className="share-event">
                        <span className="title">Share Event:</span>
                        <ul>
                          <li className="share">
                            <span />
                          </li>
                          <li className="add">
                            <span />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9 col-md-12">
                  <div className="about-event-content">
                    <p>
                      Escape the craziness of holiday season for a couple of
                      hours and join CitySwoon and a group of NYC singles aged
                      25-37 on a Matched Date Night @ Sons of Essex!
                      <br />
                      <br />
                      You will go on a series of live matched mini dates,
                      lasting around 10-12 minutes each and find each other via
                      your smartphones. <br />
                      <br />
                      Because it's mobile, everyone dates wherever they want -
                      no name tags or table numbers - in a fantastic atmosphere.
                      <br />
                      <br />
                      CitySwoon's Matched Dating is run by a sophisticated
                      patented algorithm. The success rate is higher than both
                      online dating and speed dating, but don't let the tech
                      fool you - this is ALL about meeting REAL people in REAL
                      life!
                      <br />
                      <br />
                      Tickets are limited by venue capacity so get yours soon!
                    </p>
                    <div className="goings" data-tut="going">
                      <div className="content">
                        <ul>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1001.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1002.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1003.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1004.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1005.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1006.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1003.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1004.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1005.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1006.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1003.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1004.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1005.png"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              src="../assets/img/usr/medium-avatar/1006.png"
                              alt=""
                            />
                          </li>
                        </ul>
                        <span className="stats">
                          <b>32 people</b> going
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="event-info-content hid-desktop"
                    data-tut="infoM"
                  >
                    <div className="event-image">
                      <span>
                        <img src="../assets/img/events/1001.png" alt="" />
                      </span>
                    </div>
                    <ul>
                      <li>
                        <span className="head">Event Date:</span>
                        <span className="title">22 December 2018, Monday</span>
                      </li>
                      <li>
                        <span className="head">Event Time:</span>
                        <span className="title">20:00 - 24:00</span>
                      </li>
                      <li>
                        <span className="head">Type:</span>
                        <span className="title">Public</span>
                      </li>
                      <li>
                        <span className="head">Interested:</span>
                        <span className="title">Flirting, Dating</span>
                      </li>
                      <li>
                        <span className="head">What to Expect:</span>
                        <span className="title">Expect</span>
                      </li>
                      <li>
                        <span className="head">Away:</span>
                        <span className="title">12.50 Miles</span>
                      </li>
                      <li>
                        <span className="head">Address:</span>
                        <span className="title address">
                          Elixir Saloon
                          <p>
                            3200 16th St, San Francisco, CA 94103United States
                          </p>
                        </span>
                      </li>
                    </ul>
                    <div className="join-event">
                      <a href="#">I'm Going</a>
                    </div>
                  </div>
                  <div className="discuss-content" data-tut="discuss">
                    <span className="head">Discuss this event</span>
                    <div className="send-message">
                      <textarea placeholder="Now you can join the discussion by writing a message…" />
                      <button>Post Comment</button>
                    </div>
                    <div className="messages">
                      <div className="item">
                        <span className="avatar">
                          <a href="#">
                            <img
                              src="../assets/img/usr/medium-avatar/1001.png"
                              alt=""
                            />
                          </a>
                        </span>
                        <div className="info">
                          <span className="name">
                            <a href="#">Barbara Blair</a>
                          </span>
                          <span className="date">22 December 2018 - 14:52</span>

                          <span className="msg">
                            It is a long established fact that a reader will be
                            distracted by the readable content of a page when
                            looking at its layout.
                          </span>
                        </div>
                      </div>
                      <div className="item">
                        <span className="avatar">
                          <a href="#">
                            <img
                              src="../assets/img/usr/medium-avatar/1002.png"
                              alt=""
                            />
                          </a>
                        </span>
                        <div className="info">
                          <span className="name">
                            <a href="#">Mariana Anna</a>
                          </span>
                          <span className="date">22 December 2018 - 14:52</span>

                          <span className="msg">
                            Lorem Ipsum has been the industry's standard dummy
                            text ever since the 1500s, when an unknown printer
                            took a galley of type and scrambled it to make a
                            type specimen book.
                          </span>
                        </div>
                      </div>
                      <div className="item">
                        <span className="avatar">
                          <a href="#">
                            <img
                              src="../assets/img/usr/medium-avatar/1003.png"
                              alt=""
                            />
                          </a>
                        </span>
                        <div className="info">
                          <span className="name">
                            <a href="#">Amanda Turner</a>
                          </span>
                          <span className="date">22 December 2018 - 14:52</span>

                          <span className="msg">
                            Lorem Ipsum has been the industry's standard dummy
                            text ever since the 1500s, when an unknown printer
                            took a galley of type and scrambled it to make a
                            type specimen book.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12">
                  <div
                    className="event-info-content hid-mobile"
                    data-tut="info"
                  >
                    <div className="event-image">
                      <span>
                        <img src="../assets/img/events/1001.png" alt="" />
                      </span>
                    </div>
                    <ul>
                      <li>
                        <span className="head">Event Date:</span>
                        <span className="title">22 December 2018, Monday</span>
                      </li>
                      <li>
                        <span className="head">Event Time:</span>
                        <span className="title">20:00 - 24:00</span>
                      </li>
                      <li>
                        <span className="head">Type:</span>
                        <span className="title">Public</span>
                      </li>
                      <li>
                        <span className="head">Interested:</span>
                        <span className="title">Flirting, Dating</span>
                      </li>
                      <li>
                        <span className="head">What to Expect:</span>
                        <span className="title">Expect</span>
                      </li>
                      <li>
                        <span className="head">Away:</span>
                        <span className="title">12.50 Miles</span>
                      </li>
                      <li>
                        <span className="head">Address:</span>
                        <span className="title address">
                          Elixir Saloon
                          <p>
                            3200 16th St, San Francisco, CA 94103United States
                          </p>
                        </span>
                      </li>
                    </ul>
                    <div className="join-event">
                      <span>{t("Going")}</span>
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
            tour: "e"
          }}
        >
          {seenTour => {
            const closeTour = () => this.closeTour(seenTour);
            return (
              <div>
                <CustomTour
                  onTourClose={closeTour}
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

export default withAuth(session => session && session.currentuser)(
  withRouter(withNamespaces("profile")(ProfileTour))
);
