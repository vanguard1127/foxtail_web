import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { SEEN_TOUR } from "../../queries";
import { withTranslation } from "react-i18next";
import CustomTour from "../common/CustomTour";
import Spinner from "../common/Spinner";
import { withRouter } from "react-router-dom";
class Tour extends PureComponent {
  state = {
    isTourOpen: true
  };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  closeTour = (seenTour, isEvent) => {
    seenTour()
      .then(({ data }) => {
        this.props.refetchUser();
        if (isEvent) {
          this.props.history.push("/event/tour");
        } else {
          window.location.reload(false);
        }
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res);
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
    const { t, tReady } = this.props;
    const { isTourOpen } = this.state;

    if (!tReady) {
      return <Spinner />;
    }
    const tourConfig = [
      {
        selector: '[data-tut=""]',
        content: "Let's find an event nearby to attend."
      },

      {
        selector: '[data-tut="search"]',
        content: t(
          "Here you can limit your search to events near you. *Only BLACK members can change their location."
        )
      },
      {
        selector: '[data-tut="create"]',
        content: t(
          "If you want to create your own event for the Foxtail community to attend. Click 'Create Event'"
        )
      },
      {
        selector: '[data-tut="myevents"]',
        content: t("These are the events you've planned to attend")
      },
      {
        selector: '[data-tut="events"]',
        content: t("Events meeting your criteria, are here sorted by date.")
      },
      {
        selector: '[data-tut="item"]',
        content: t("Let's look at this event. **Hint: Click the Event Name**")
      }
    ];

    return (
      <Mutation
        mutation={SEEN_TOUR}
        variables={{
          tour: "se"
        }}
      >
        {seenTour => {
          return (
            <div>
              <section className="breadcrumb">
                <div className="container">
                  <div className="col-md-12">
                    <span className="head">{t("common:goevents")}</span>
                    <span className="title">{t("common:eventsubtitle")}</span>
                  </div>
                </div>
              </section>
              <section className="go-events">
                <div className="header">
                  <div className="container">
                    <div className="col-md-12">
                      <div className="settings-con" data-tut="search">
                        <div>
                          <div className="select-container dropdown">
                            <label>{t("disway")}:</label>
                            <span>50 miles</span>
                          </div>
                        </div>
                        <div>
                          <label>{t("From")}:</label>
                          <div className="search">
                            <div style={{ display: "flex" }}>
                              <input
                                type="text"
                                aria-autocomplete="list"
                                placeholder={t("Search by city")}
                                className="location-search-input"
                                value={t("My Location")}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="create-event-btn" data-tut="create">
                        <a href="#">{t("Create Event")}</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="events-card-content my-events"
                  data-tut="myevents"
                >
                  <div className="container">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-12">
                          <span className="head">{t("myevents")}</span>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <div
                            className="card-item"
                            onClick={() => this.closeTour(seenTour, true)}
                          >
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1006@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Naked Yoga on the Beach</a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <div className="card-item">
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1001@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Brunch Munch</a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="events-card-content" data-tut="events">
                  <div className="container">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-12">
                          <span className="head">{t("upcomingevent")}</span>
                        </div>
                        <div
                          className="col-md-12 col-lg-6"
                          onClick={() => this.closeTour(seenTour, true)}
                        >
                          <div className="card-item" data-tut="item">
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Cleiv</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1001@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">
                                  New Year Date Night @ Elixir Saloon!
                                </a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <div className="card-item">
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1002@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Midnight @ My House</a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <div className="card-item">
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1005@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Sexy Hot Tub Party!</a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <div className="card-item">
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1007@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Private Ladies Night</a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <div className="card-item">
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1002@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Swapping Friends Meetup</a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <div className="card-item">
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1003@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Group Play - Game Night</a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <div className="card-item">
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1009@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">BDSM Forum</a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6">
                          <div className="card-item">
                            <div className="thumbnail">
                              <div className="date">
                                <span>19</span>
                                <span>Dec</span>
                                <span>20:00</span>
                              </div>
                              <div className="created">
                                <a href="#user">
                                  <span className="avatar">
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src={
                                    process.env.REACT_APP_S3_BUCKET_URL+"tour/" +
                                    "events/1008@2x.png"
                                  }
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Shibari 101</a>
                              </div>
                              <span className="distance">
                                9.2 {t("miaway")}
                              </span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1001@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1002@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1003@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1004@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1005@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src={
                                        process.env
                                          .REACT_APP_S3_BUCKET_URL+"tour/" +
                                        "usr/avatar/1006@2x.png"
                                      }
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 {t("people")}</b> {t("going")}
                                </span>
                              </div>
                              <div
                                className="functions"
                                onClick={() => this.closeTour(seenTour, true)}
                              >
                                <div className="btn go-detail">
                                  <a href="#">{t("eventdetail")}</a>
                                </div>
                                <div className="btn share">
                                  <a href="#" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="more-content-btn">
                            <a href="#">{t("moreevents")}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div>
                <CustomTour
                  onTourClose={() => this.closeTour(seenTour, false)}
                  tourConfig={tourConfig}
                  isTourOpen={isTourOpen}
                />
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(withTranslation("searchevents")(Tour));
