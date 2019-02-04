import React, { Component, Fragment } from 'react';
import { withNamespaces } from 'react-i18next';
import { Mutation } from 'react-apollo';
import { SEEN_TOUR } from '../../queries';
import CustomTour from '../common/CustomTour';
import withAuth from '../withAuth';
import { withRouter } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
class ProfileTour extends Component {
  state = {
    isTourOpen: true
  };

  closeTour = seenTour => {
    seenTour()
      .then(({ data }) => {
        this.props.refetchUser();
        this.props.history.push('/members');
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
    this.setState({ isTourOpen: false });
  };

  openTour = () => {
    this.setState({ isTourOpen: true });
  };

  render() {
    const lang = localStorage.getItem('i18nextLng');
    const { t } = this.props;
    const { isTourOpen } = this.state;

    let showDesire = '[data-tut="desires"]';
    if (window.innerWidth < 768) {
      showDesire = '[data-tut="desiresM"]';
    }

    const tourConfig = [
      {
        selector: '[data-tut="page"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="info"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: showDesire,
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="btns"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="na"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
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
                          src="/assets/img/usr/big-avatar/1003@2x.png"
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
                <div className="col-md-9" data-tut="info">
                  <div className="user-info online">
                    <div>
                      <span> Meg,</span>
                      <span> 31,</span>
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
                        <div className="share btn">
                          <button>Share</button>
                        </div>
                        <div className="report btn">
                          <button>Report</button>
                        </div>
                      </li>
                    </ul>
                    <div className="functions">
                      <div className="share btn">
                        <button>Share</button>
                      </div>
                      <div className="report btn">
                        <button>Report</button>
                      </div>
                    </div>
                  </div>
                  <div className="user-bio">
                    <div className="profile-head">User Bio</div>
                    <p>New member</p>
                  </div>
                  <div className="mobile desires" data-tut="desiresM">
                    <div className="profile-head">Desires</div>
                    <ul>
                      <li>cuddling</li>
                      <li>dating</li>
                    </ul>
                  </div>
                  <div className={'photos-slider public'}>
                    <div className="profile-head">{t('Public')} (4)</div>
                    <div id="lightgallery" ref={this.onLightGallery}>
                      <OwlCarousel
                        className="owl-carousel slider-content"
                        autoplay
                        margin={30}
                        nav
                        dots={false}
                        navText={[
                          '<i class="icon-left-open">',
                          '<i class="icon-right-open">'
                        ]}
                        lazyLoad
                        autoplayTimeout={2400}
                        autoplayHoverPause={false}
                        responsive={{
                          0: {
                            items: 2,
                            margin: 15
                          },
                          768: {
                            items: 3,
                            margin: 15
                          },
                          992: {
                            items: 4,
                            margin: 15
                          },
                          1200: {
                            items: 6
                          }
                        }}
                      >
                        <div className="item" key={Math.random()}>
                          <a href={'/assets/img/usr/big-avatar/1003@2x.png'}>
                            <img
                              src={'/assets/img/usr/big-avatar/1003@2x.png'}
                              alt=""
                            />
                          </a>
                        </div>{' '}
                        <div className="item" key={Math.random()}>
                          <a href={'/assets/img/usr/big-avatar/1003@2x.png'}>
                            <img
                              src={'/assets/img/usr/big-avatar/1003@2x.png'}
                              alt=""
                            />
                          </a>
                        </div>{' '}
                        <div className="item" key={Math.random()}>
                          <a href={'/assets/img/usr/big-avatar/1003@2x.png'}>
                            <img
                              src={'/assets/img/usr/big-avatar/1003@2x.png'}
                              alt=""
                            />
                          </a>
                        </div>{' '}
                        <div className="item" key={Math.random()}>
                          <a href={'/assets/img/usr/big-avatar/1003@2x.png'}>
                            <img
                              src={'/assets/img/usr/big-avatar/1003@2x.png'}
                              alt=""
                            />
                          </a>
                        </div>
                      </OwlCarousel>
                    </div>
                  </div>
                  <div className={'photos-slider private'}>
                    <div className="profile-head">{t('Private')} (4)</div>
                    <div id="lightgallery" ref={this.onLightGallery}>
                      <OwlCarousel
                        className="owl-carousel slider-content"
                        autoplay
                        margin={30}
                        nav
                        dots={false}
                        navText={[
                          '<i class="icon-left-open">',
                          '<i class="icon-right-open">'
                        ]}
                        lazyLoad
                        autoplayTimeout={2400}
                        autoplayHoverPause={false}
                        responsive={{
                          0: {
                            items: 2,
                            margin: 15
                          },
                          768: {
                            items: 3,
                            margin: 15
                          },
                          992: {
                            items: 4,
                            margin: 15
                          },
                          1200: {
                            items: 6
                          }
                        }}
                      >
                        <div className="item" key={Math.random()}>
                          <a href={'/assets/img/usr/big-avatar/1003@2x.png'}>
                            <img
                              src={'/assets/img/usr/big-avatar/1003@2x.png'}
                              alt=""
                            />
                          </a>
                        </div>{' '}
                        <div className="item" key={Math.random()}>
                          <a href={'/assets/img/usr/big-avatar/1003@2x.png'}>
                            <img
                              src={'/assets/img/usr/big-avatar/1003@2x.png'}
                              alt=""
                            />
                          </a>
                        </div>{' '}
                        <div className="item" key={Math.random()}>
                          <a href={'/assets/img/usr/big-avatar/1003@2x.png'}>
                            <img
                              src={'/assets/img/usr/big-avatar/1003@2x.png'}
                              alt=""
                            />
                          </a>
                        </div>{' '}
                        <div className="item" key={Math.random()}>
                          <a href={'/assets/img/usr/big-avatar/1003@2x.png'}>
                            <img
                              src={'/assets/img/usr/big-avatar/1003@2x.png'}
                              alt=""
                            />
                          </a>
                        </div>
                      </OwlCarousel>
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
            tour: 'p'
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

export default withAuth(session => session && session.currentuser)(
  withRouter(withNamespaces('profile')(ProfileTour))
);
