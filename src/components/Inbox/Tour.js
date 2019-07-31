import React, { PureComponent, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { Mutation } from "react-apollo";
import { SEEN_TOUR } from "../../queries";
import Spinner from "../common/Spinner";
import CustomTour from "../common/CustomTour";
import { withRouter } from "react-router-dom";
class ProfileTour extends PureComponent {
  state = {
    isTourOpen: true,
    menuOpen: true,
    goToStep: 0
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
        this.props.history.push("/inbox");
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

  toggleMenu = () => {
    if (this.mounted) {
      this.setState({ menuOpen: false, goToStep: 0 });
    }
  };

  render() {
    const { t, tReady } = this.props;
    const { isTourOpen, menuOpen, goToStep } = this.state;
    if (!tReady) {
      return <Spinner />;
    }
    let tourConfig = [
      {
        selector: '[data-tut=""]',
        content: t("Welcome to your Inbox.")
      },
      {
        selector: '[data-tut="list"]',
        content: t("These are your chats.")
      },
      {
        selector: '[data-tut="item"]',
        content: t("Each chat shows the number of messages you haven't seen."),
        observe: '[data-tut="actions"]'
      },
      {
        selector: '[data-tut="actions"]',
        content: t(
          "Your chat actions can be found here including leaving and reporting a chat. Please report any behavior that makes you uncomfortable."
        )
      },
      {
        selector: '[data-tut="na"]',
        content: t(
          "If no chat is selected there will be random information or ads here."
        )
      }
    ];

    if (window.innerWidth < 1200 && menuOpen) {
      tourConfig = [
        {
          selector: '[data-tut=""]',
          content: t("Welcome to your Inbox.")
        },
        {
          selector: '[data-tut="list"]',
          content: t(
            "These are your chats. **Hint: Click one to see messages**"
          )
        }
      ];
    } else if (window.innerWidth < 1200) {
      tourConfig = [
        {
          selector: '[data-tut="menubtn"]',
          content: t("Clicking the menu to the right will open chat actions.")
        },
        {
          selector: '[data-tut="na"]',
          content: t(
            "If no chat is selected there will be random information or ads here."
          )
        }
      ];
    }
    const toggleOn = window.innerWidth < 1200 ? this.toggleMenu() : null;
    return (
      <Fragment>
        <section className="breadcrumb">
          <div className="container">
            <div className="col-md-12">
              <span className={menuOpen ? "head" : "head back"}>
                <a href="#">{t("Inbox")}</a>
              </span>
              <span className="title">{t("subtitle")}. </span>
            </div>
          </div>
        </section>
        <section className="inbox">
          <div className="row no-gutters">
            <div className="col-md-4 col-lg-3 col-xl-3">
              <div
                className={menuOpen ? "left" : "left hide"}
                data-tut="list"
                ref={selectContainerRef =>
                  (this.selectContainerRef = selectContainerRef)
                }
              >
                <div className="search">
                  <input type="text" placeholder={t("search")} />
                </div>

                <div className="conversations">
                  <div className="item unread" data-tut="item">
                    <span onClick={toggleOn} className="inbox-item">
                      <span className="img">
                        <img
                          src="../assets/img/usr/medium-avatar/1001.png"
                          alt=""
                        />
                      </span>
                      <div className="data">
                        <span className="name">Barbara Blair</span>
                        <span className="time">01:09 AM</span>
                        <span className="msg">Do you remember the name?</span>
                        <span className="notif">1</span>
                      </div>
                    </span>
                  </div>
                  <div className="item unread">
                    <span onClick={toggleOn} className="inbox-item">
                      <span className="img">
                        <img
                          src="../assets/img/usr/medium-avatar/1002.png"
                          alt=""
                        />
                      </span>
                      <div className="data">
                        <span className="name">Maria Anna</span>
                        <span className="time">12:22 PM</span>
                        <span className="msg">My animals are pretty!</span>
                        <span className="notif">1</span>
                      </div>
                    </span>
                  </div>
                  <div className="item">
                    <span onClick={toggleOn} className="inbox-item">
                      <span className="img">
                        <img
                          src="../assets/img/usr/medium-avatar/1003.png"
                          alt=""
                        />
                      </span>
                      <div className="data">
                        <span className="name">Maya Didas</span>
                        <span className="time">08:55 AM</span>
                        <span className="msg">
                          Good, we’re going to fly next week. Are you here?
                        </span>
                        <span className="notif">1</span>
                      </div>
                    </span>
                  </div>
                  <div className="item">
                    <span onClick={toggleOn} className="inbox-item">
                      <span className="img">
                        <img
                          src="../assets/img/usr/medium-avatar/1004.png"
                          alt=""
                        />
                      </span>
                      <div className="data">
                        <span className="name">Amanda Turner</span>
                        <span className="time">03:33 AM</span>
                        <span className="msg">
                          Let’s meet at best pizza house
                        </span>
                        <span className="notif">1</span>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-lg-9 col-xl-7">
              <div className={menuOpen ? "chat" : "chat show"}>
                <div className="navbar">
                  <div className="user">
                    <div className="avatar">
                      <a href="#">
                        <img
                          src="../assets/img/usr/medium-avatar/1001.png"
                          alt=""
                        />
                      </a>
                    </div>
                    <span className="name couple">
                      <a href="#">Barbara Blair &amp; Chris Martin</a>
                    </span>
                    <span className="last-seen online">Active Now</span>
                  </div>
                  <div className="more" />
                  <div className="more-dropdown open" data-tut="menubtn">
                    <ul>
                      <li>
                        <a href="#">Participants</a>
                      </li>
                      <li>
                        <a href="#">Remove Members</a>
                      </li>
                      <li>
                        <a href="#">Leave Conversation</a>
                      </li>
                      <li>
                        <a href="#">Report Conversation</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="content">
                  <div className="msg-item">
                    <div className="avatar">
                      <img
                        src="../assets/img/usr/medium-avatar/1001.png"
                        alt=""
                      />
                    </div>
                    <div className="bubble">
                      Morning! Beautiful start of the day how is things going
                      there?
                    </div>
                    <span className="time">10:02 AM</span>
                  </div>
                  <div className="msg-item">
                    <div className="avatar">
                      <img
                        src="../assets/img/usr/medium-avatar/1001.png"
                        alt=""
                      />
                    </div>
                    <div className="bubble">Are u here darling?</div>
                    <span className="time">10:02 AM</span>
                  </div>
                  <div className="msg-item response">
                    <div className="avatar">
                      <img
                        src="../assets/img/usr/medium-avatar/1001.png"
                        alt=""
                      />
                    </div>
                    <div className="bubble">Dr Peersy? Yup, nice here too!</div>
                    <span className="time">10:02 AM</span>
                  </div>
                  <div className="msg-item">
                    <div className="avatar">
                      <img
                        src="../assets/img/usr/medium-avatar/1001.png"
                        alt=""
                      />
                    </div>
                    <div className="bubble">
                      Last night I'll arrive from here.
                    </div>
                    <span className="time">10:02 AM</span>
                  </div>
                  <div className="msg-item response">
                    <div className="avatar">
                      <img
                        src="../assets/img/usr/medium-avatar/1001.png"
                        alt=""
                      />
                    </div>
                    <div className="bubble">When did you get back?</div>
                    <span className="time">10:02 AM</span>
                  </div>
                </div>
                <div className="panel">
                  <div className="files" />
                  <div className="textarea">
                    <input placeholder={t("typemsg")} />
                  </div>
                  <div className="send">
                    <button>{t("Send")}</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2">
              <div className="right" data-tut="actions">
                <div className="head" />
                <div className="content">
                  <div className="functions">
                    <ul>
                      <li className="members">
                        <span>{t("participants")}</span>
                      </li>
                      <li className="invite">
                        <span>{t("invitemem")}</span>
                      </li>
                      <li className="leave">
                        <span>{t("leaveconv")}</span>
                      </li>{" "}
                      <li className="report">
                        <span>{t("reportconv")}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Mutation
          mutation={SEEN_TOUR}
          variables={{
            tour: "i"
          }}
        >
          {seenTour => {
            return (
              <div>
                <CustomTour
                  onTourClose={() => this.closeTour(seenTour)}
                  tourConfig={tourConfig}
                  isTourOpen={isTourOpen}
                  goToStep={goToStep}
                />
              </div>
            );
          }}
        </Mutation>
      </Fragment>
    );
  }
}

export default withRouter(withTranslation("inbox")(ProfileTour));
