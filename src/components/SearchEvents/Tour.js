import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import { SEEN_TOUR } from '../../queries';
import { withNamespaces } from 'react-i18next';
import CustomTour from '../common/CustomTour';
import { withRouter } from 'react-router-dom';
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
          this.props.history.push('/event/tour');
        } else {
          this.props.history.push('/events');
        }
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
    const lang = localStorage.getItem('i18nextLng');
    const { t } = this.props;
    const { isTourOpen } = this.state;
    const tourConfig = [
      {
        selector: '[data-tut="page"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },

      {
        selector: '[data-tut="search"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="create"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="myevents"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="events"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="item"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      }
    ];

    return (
      <Mutation
        mutation={SEEN_TOUR}
        variables={{
          tour: 'se'
        }}
      >
        {seenTour => {
          return (
            <div>
              <section className="breadcrumb">
                <div className="container">
                  <div className="col-md-12">
                    <span className="head">Go to Events</span>
                    <span className="title">
                      Attend events nearby. Discuss events you're attending
                    </span>
                  </div>
                </div>
              </section>
              <section className="go-events" data-tut="page">
                <div className="header">
                  <div className="container">
                    <div className="col-md-12">
                      <div className="settings-con" data-tut="search">
                        <div>
                          <div className="select-container dropdown">
                            <label>Distance Away:</label>
                            <span>50 miles</span>
                          </div>
                        </div>
                        <div>
                          <label>From:</label>
                          <div className="search">
                            <div style={{ display: 'flex' }}>
                              <input
                                type="text"
                                aria-autocomplete="list"
                                placeholder="Search by city..."
                                className="location-search-input"
                                value="My Location"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="create-event-btn" data-tut="create">
                        <a href="#">Create Event</a>
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
                          <span className="head">My Events</span>
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1001@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1001@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                          <span className="head">Oncoming Events</span>
                        </div>
                        <div className="col-md-12 col-lg-6">
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1001@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1001@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1003@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1004@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1001@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1001@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1003@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </span>
                                  <span className="name">Barbara Blair</span>
                                </a>
                              </div>
                              <a href="#link">
                                <img
                                  src="assets/img/events/1004@2x.png"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="content">
                              <div className="event-name">
                                <a href="#">Date Night In The East Village!</a>
                              </div>
                              <span className="distance">9.2 mil away</span>
                              <div className="goings">
                                <ul>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1001@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1002@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1003@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1004@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1005@2x.png"
                                      alt=""
                                    />
                                  </li>
                                  <li>
                                    <img
                                      src="assets/img/usr/avatar/1006@2x.png"
                                      alt=""
                                    />
                                  </li>
                                </ul>
                                <span className="stats">
                                  <b>32 people</b> going
                                </span>
                              </div>
                              <div className="functions">
                                <div className="btn go-detail">
                                  <a href="#">Event Detail</a>
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
                            <a href="#">More Events</a>
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

export default withRouter(withNamespaces('searchevents')(Tour));
