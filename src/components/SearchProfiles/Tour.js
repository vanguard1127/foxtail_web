import React, { Component, Fragment } from 'react';
import { withNamespaces } from 'react-i18next';
import { Mutation } from 'react-apollo';
import { SEEN_TOUR } from '../../queries';
import CustomTour from '../common/CustomTour';
import { withRouter } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
class Tour extends Component {
  state = {
    isTourOpen: true
  };

  closeTour = (seenTour, isProfile) => {
    seenTour()
      .then(({ data }) => {
        this.props.refetchUser();
        if (isProfile) {
          this.props.history.push('/member/tour');
        } else {
          this.props.history.push('/members');
        }
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

    const tourConfig = [
      {
        selector: '[data-tut="page"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="criteria"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="featured"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="profiles"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      },
      {
        selector: '[data-tut="single"]',
        content: `Ok, let's start with the name of the Tour that is about to begin.`
      }
    ];

    return (
      <Mutation
        mutation={SEEN_TOUR}
        variables={{
          tour: 'sp'
        }}
      >
        {seenTour => {
          return (
            <div data-tut="page">
              <section className="meet-filter">
                <div className="container" data-tut="criteria">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="item">
                          <div className="search">
                            <div style={{ display: 'flex' }}>
                              <input
                                className={'location-search-input'}
                                value="  My Location"
                                readOnly
                              />
                              <span
                                style={{
                                  flex: '1',
                                  backgroundColor: 'transparent',
                                  marginLeft: '-7%'
                                }}
                              >
                                {t('Reset')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="item">
                          <div>
                            <div className="select-container dropdown">
                              <label>Interested In:</label>
                              <div className="multiple-options" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="item">
                          <div className="range-head">Distance:</div>
                          <div className="rc-slider range-con">
                            <div className="rc-slider-rail" />
                            <div
                              className="rc-slider-track"
                              style={{ left: '0%', width: '100%' }}
                            />
                            <div className="rc-slider-step" />
                            <div
                              tabIndex="0"
                              className="rc-slider-handle"
                              role="slider"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              aria-valuenow="100"
                              aria-disabled="false"
                              style={{ left: '100%' }}
                            />
                            <div className="rc-slider-mark" />
                          </div>
                          <div className="limit">
                            <span>&lt; 1 mil</span>
                            <span>100 mil</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="item">
                          <div className="range-head">Age:</div>
                          <div className="rc-slider range-con">
                            <div className="rc-slider-rail" />
                            <div
                              className="rc-slider-track rc-slider-track-1"
                              style={{ left: '0%', width: '100%' }}
                            />
                            <div className="rc-slider-step" />
                            <div
                              tabIndex="0"
                              className="rc-slider-handle rc-slider-handle-1"
                              role="slider"
                              aria-valuemin="18"
                              aria-valuemax="80"
                              aria-valuenow="18"
                              aria-disabled="false"
                              style={{ left: '0%' }}
                            />
                            <div
                              tabIndex="0"
                              className="rc-slider-handle rc-slider-handle-2"
                              role="slider"
                              aria-valuemin="18"
                              aria-valuemax="80"
                              aria-valuenow="80"
                              aria-disabled="false"
                              style={{ left: '100%' }}
                            />
                            <div className="rc-slider-mark" />
                          </div>
                          <div className="limit">
                            <span>18 years</span>
                            <span>80+ years</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="featured-profiles"
                key="na"
                data-tut="featured"
              >
                <div className="container">
                  <div className="col-md-12">
                    <span className="head">{t('featmems')}</span>
                    <OwlCarousel
                      className="owl-carousel slider"
                      autoplay
                      margin={30}
                      nav
                      dots={false}
                      navText={[
                        '<i className="icon-left-open">',
                        '<i className="icon-right-open">'
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
                          items: 4
                        }
                      }}
                    >
                      <div className="item verified">
                        <div className="info">
                          <a href="#">
                            <div className="data">
                              <span className="name online">Dorothy</span>
                              <span className="detail">
                                <ul>
                                  <li className="gender f">24</li>

                                  <li>- 8.4 mil</li>
                                </ul>
                              </span>
                              <span className="interest">
                                <ul>
                                  <li>BDSM</li>
                                  <li>Flirting</li>
                                  <li>...</li>
                                </ul>
                              </span>
                            </div>
                            <div className="image">
                              <img
                                src="assets/img/usr/big-avatar/1001@2x.png"
                                alt=""
                              />
                            </div>
                          </a>
                        </div>
                        <div className="function">
                          <div className="btn heart">
                            <a href="#" />
                          </div>
                          <div className="btn message">
                            <a href="#" />
                          </div>
                        </div>
                      </div>
                      <div className="item">
                        <div className="info">
                          <a href="#">
                            <div className="data">
                              <span className="name online">
                                Eearl & Christina
                              </span>
                              <span className="detail">
                                <ul>
                                  <li className="gender f">24</li>
                                  <li className="gender m">32</li>
                                  <li>- 4.2 mil</li>
                                </ul>
                              </span>
                              <span className="interest">
                                <ul>
                                  <li>Cudding</li>
                                  <li>Sexting</li>
                                  <li>...</li>
                                </ul>
                              </span>
                            </div>
                            <div className="image">
                              <img
                                src="assets/img/usr/big-avatar/1002@2x.png"
                                alt=""
                              />
                            </div>
                          </a>
                        </div>
                        <div className="function">
                          <div className="btn heart">
                            <a href="#" />
                          </div>
                          <div className="btn message">
                            <a href="#" />
                          </div>
                        </div>
                      </div>
                      <div className="item verified">
                        <div className="info">
                          <a href="#">
                            <div className="data">
                              <span className="name online">Barbara</span>
                              <span className="detail">
                                <ul>
                                  <li className="gender f">32</li>
                                  <li>- 4.9 mil</li>
                                </ul>
                              </span>
                              <span className="interest">
                                <ul>
                                  <li>Flirting</li>
                                </ul>
                              </span>
                            </div>
                            <div className="image">
                              <img
                                src="assets/img/usr/big-avatar/1003@2x.png"
                                alt=""
                              />
                            </div>
                          </a>
                        </div>
                        <div className="function">
                          <div className="btn heart">
                            <a href="#" />
                          </div>
                          <div className="btn message">
                            <a href="#" />
                          </div>
                        </div>
                      </div>
                      <div className="item">
                        <div className="info">
                          <a href="#">
                            <div className="data">
                              <span className="name online">Amanda</span>
                              <span className="detail">
                                <ul>
                                  <li className="gender f">28</li>
                                  <li>- 4.9 mil</li>
                                </ul>
                              </span>
                              <span className="interest">
                                <ul>
                                  <li>Cooking</li>
                                  <li>Flirting</li>
                                  <li>...</li>
                                </ul>
                              </span>
                            </div>
                            <div className="image">
                              <img
                                src="assets/img/usr/big-avatar/1004@2x.png"
                                alt=""
                              />
                            </div>
                          </a>
                        </div>
                        <div className="function">
                          <div className="btn heart">
                            <a href="#" />
                          </div>
                          <div className="btn message">
                            <a href="#" />
                          </div>
                        </div>
                      </div>
                    </OwlCarousel>
                  </div>
                </div>
              </section>

              <section className="members">
                <div className="container" data-tut="profiles">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-12">
                        <span className="head">All Members</span>
                      </div>
                      <div className="col-md-6 col-lg-4" data-tut="single">
                        <div
                          className="card-item verified"
                          onClick={() => this.closeTour(seenTour, true)}
                        >
                          <div className="image">
                            <a href="#">
                              <img
                                src="assets/img/usr/medium-avatar/1001@2x.png"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="info">
                            <span className="name online">
                              <a href="#">Barbara & Edward</a>
                            </span>
                            <span className="detail">
                              <ul>
                                <li className="gender f">24</li>
                                <li className="gender m">32</li>
                                <li>- 8.4 mil</li>
                              </ul>
                            </span>
                            <span className="interest">
                              <ul>
                                <li>BDSM</li>
                                <li>Flirting</li>
                                <li>...</li>
                              </ul>
                            </span>
                            <div className="function">
                              <div className="btn heart">
                                <a href="#" />
                              </div>
                              <div className="btn message">
                                <a href="#" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="card-item verified">
                          <div className="image">
                            <a href="#">
                              <img
                                src="assets/img/usr/medium-avatar/1002@2x.png"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="info">
                            <span className="name online">
                              <a href="#">Margaret</a>
                            </span>
                            <span className="detail">
                              <ul>
                                <li className="gender f">24</li>
                                <li>- 4.9 mil</li>
                              </ul>
                            </span>
                            <span className="interest">
                              <ul>
                                <li>Cudding</li>
                                <li>Flirting</li>
                              </ul>
                            </span>
                            <div className="function">
                              <div className="btn heart">
                                <a href="#" />
                              </div>
                              <div className="btn message">
                                <a href="#" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="card-item">
                          <div className="image">
                            <a href="#">
                              <img
                                src="assets/img/usr/medium-avatar/1003@2x.png"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="info">
                            <span className="name online">
                              <a href="#">Heather</a>
                            </span>
                            <span className="detail">
                              <ul>
                                <li className="gender f">32</li>
                                <li>- 9.9 mil</li>
                              </ul>
                            </span>
                            <span className="interest">
                              <ul>
                                <li>Sexting</li>
                              </ul>
                            </span>
                            <div className="function">
                              <div className="btn heart">
                                <a href="#" />
                              </div>
                              <div className="btn message">
                                <a href="#" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="card-item">
                          <div className="image">
                            <a href="#">
                              <img
                                src="assets/img/usr/medium-avatar/1004@2x.png"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="info">
                            <span className="name online">
                              <a href="#">Laura</a>
                            </span>
                            <span className="detail">
                              <ul>
                                <li className="gender f">27</li>
                                <li>- 4.9 mil</li>
                              </ul>
                            </span>
                            <span className="interest">
                              <ul>
                                <li>Sexting</li>
                                <li>Flirting</li>
                              </ul>
                            </span>
                            <div className="function">
                              <div className="btn heart">
                                <a href="#" />
                              </div>
                              <div className="btn message">
                                <a href="#" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="card-item">
                          <div className="image">
                            <a href="#">
                              <img
                                src="assets/img/usr/medium-avatar/1005@2x.png"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="info">
                            <span className="name online">
                              <a href="#">Amanda</a>
                            </span>
                            <span className="detail">
                              <ul>
                                <li className="gender f">38</li>
                                <li>- 4.9 mil</li>
                              </ul>
                            </span>
                            <span className="interest">
                              <ul>
                                <li>Cooking</li>
                                <li>Dating</li>
                                <li>...</li>
                              </ul>
                            </span>
                            <div className="function">
                              <div className="btn heart">
                                <a href="#" />
                              </div>
                              <div className="btn message">
                                <a href="#" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="card-item verified">
                          <div className="image">
                            <a href="#">
                              <img
                                src="assets/img/usr/medium-avatar/1006@2x.png"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="info">
                            <span className="name online">
                              <a href="#">Celly</a>
                            </span>
                            <span className="detail">
                              <ul>
                                <li className="gender f">38</li>
                                <li>- 4.9 mil</li>
                              </ul>
                            </span>
                            <span className="interest">
                              <ul>
                                <li>Dating</li>
                                <li>Flirting</li>
                                <li>...</li>
                              </ul>
                            </span>
                            <div className="function">
                              <div className="btn heart">
                                <a href="#" />
                              </div>
                              <div className="btn message">
                                <a href="#" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="card-item verified">
                          <div className="image">
                            <a href="#">
                              <img
                                src="assets/img/usr/medium-avatar/1007@2x.png"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="info">
                            <span className="name online">
                              <a href="#">Skyler</a>
                            </span>
                            <span className="detail">
                              <ul>
                                <li className="gender f">38</li>
                                <li>- 4.9 mil</li>
                              </ul>
                            </span>
                            <span className="interest">
                              <ul>
                                <li>Dating</li>
                                <li>Flirting</li>
                                <li>...</li>
                              </ul>
                            </span>
                            <div className="function">
                              <div className="btn heart">
                                <a href="#" />
                              </div>
                              <div className="btn message">
                                <a href="#" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="card-item">
                          <div className="image">
                            <a href="#">
                              <img
                                src="assets/img/usr/medium-avatar/1008@2x.png"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="info">
                            <span className="name online">
                              <a href="#">Robin</a>
                            </span>
                            <span className="detail">
                              <ul>
                                <li className="gender f">22</li>
                                <li>- 4.9 mil</li>
                              </ul>
                            </span>
                            <span className="interest">
                              <ul>
                                <li>Dating</li>
                                <li>Flirting</li>
                                <li>...</li>
                              </ul>
                            </span>
                            <div className="function">
                              <div className="btn heart">
                                <a href="#" />
                              </div>
                              <div className="btn message">
                                <a href="#" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="card-item">
                          <div className="image">
                            <a href="#">
                              <img
                                src="assets/img/usr/medium-avatar/1009@2x.png"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="info">
                            <span className="name online">
                              <a href="#">Jasmin</a>
                            </span>
                            <span className="detail">
                              <ul>
                                <li className="gender f">38</li>
                                <li>- 4.9 mil</li>
                              </ul>
                            </span>
                            <span className="interest">
                              <ul>
                                <li>Dating</li>
                                <li>Flirting</li>
                                <li>...</li>
                              </ul>
                            </span>
                            <div className="function">
                              <div className="btn heart">
                                <a href="#" />
                              </div>
                              <div className="btn message">
                                <a href="#" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="more-content-btn">
                          <a href="#">More Profiles</a>
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

export default withRouter(withNamespaces('searchprofiles')(Tour));
