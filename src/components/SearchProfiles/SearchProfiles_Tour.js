import React, { Component, Fragment } from "react";
import { withNamespaces } from "react-i18next";
import Tour from "reactour";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import { withRouter } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import AddressSearch from "../common/AddressSearch";
import DistanceSlider from "../common/DistanceSlider";
import AgeRange from "../common/AgeRange";
import Dropdown from "../common/Dropdown";
class SearchProfilesPage extends Component {
  state = {
    ...this.props.searchCriteria,
    lat: this.props.location.lat,
    long: this.props.location.long,
    isTourOpen: true
  };

  closeTour = () => {
    this.setState({ isTourOpen: false });
  };

  openTour = () => {
    this.setState({ isTourOpen: true });
  };

  setValue = ({ name, value }) => {
    console.log(name, value);
    this.setState({ [name]: value });
  };

  setLocation = async ({ lat, long }) => {
    await this.setState({ long, lat });
  };

  render() {
    const lang = localStorage.getItem("i18nextLng");
    const { t } = this.props;
    const { isTourOpen } = this.state;
    const accentColor = "#5cb7b7";
    const tourConfig = [
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
      <Fragment>
        <section className="meet-filter">
          <div className="container" data-tut="criteria">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  <div className="item">
                    <AddressSearch
                      style={{ width: 150 }}
                      setLocationValues={null}
                      address={""}
                      type={"(cities)"}
                      placeholder={t("common:setloc") + "..."}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="item">
                    <Dropdown
                      type={"interestedIn"}
                      onChange={el => null}
                      value={[]}
                      placeholder={t("common:Interested") + ":"}
                      lang={lang}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <DistanceSlider value={0} setValue={null} t={t} disabled />
                </div>
                <div className="col-md-6">
                  <AgeRange value={[18, 80]} setValue={null} t={t} disabled />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="featured-profiles" key="na" data-tut="featured">
          <div className="container">
            <div className="col-md-12">
              <span className="head">{t("featmems")}</span>
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
                        <span className="name online">Eearl & Christina</span>
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
                  <div className="card-item verified">
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
        <Tour
          onRequestClose={this.closeTour}
          steps={tourConfig}
          isOpen={isTourOpen}
          maskClassName="mask"
          className="helper"
          rounded={5}
          accentColor={accentColor}
        />
      </Fragment>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(withLocation(withNamespaces("searchprofiles")(SearchProfilesPage)))
);
