import React, { Component } from "react";
import EventCard from "./EventCard";
import Waypoint from "react-waypoint";
import OwlCarousel from "react-owl-carousel";
import $ from "jquery";
import "lightgallery";

const configLightGallery = {
  selector: "a",
  width: "100%"
};

class EventsList extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.events !== nextProps.events) {
      return true;
    }
    return false;
  }

  onLightGallery = node => {
    this.lightGallery = node;
    $(node).lightGallery(configLightGallery);
  };

  componentWillUnmount() {
    try {
      $(this.lightGallery).lightGallery("destroy");
    } catch (e) {}
  }

  render() {
    const { events, handleEnd, t, dayjs } = this.props;
    return (
      <div className="events-card-content">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <span className="head">{t("upcomingevent")}</span>
              </div>
              <div id="lightgallery" ref={this.onLightGallery}>
                <OwlCarousel
                  nav
                  autoplay
                  lazyLoad
                  margin={30}
                  navText={[
                    '<i class="icon-left-open">',
                    '<i class="icon-right-open">'
                  ]}
                  className="owl-carousel slider-content"
                  autoplayTimeout={2400}
                  responsive={{
                    0: {
                      items: 1,
                      margin: 15
                    },
                    992: {
                      items: 2,
                      margin: 15
                    }
                  }}
                >
                  {events.map(event => (
                    <EventCard
                      key={Math.random()}
                      event={event}
                      t={t}
                      dayjs={dayjs}
                    />
                  ))}
                </OwlCarousel>
              </div>
              <Waypoint
                onEnter={({ previousPosition }) => handleEnd(previousPosition)}
              />
              <div className="col-md-12">
                <div className="more-content-btn">
                  <span>{t("noevent")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventsList;
