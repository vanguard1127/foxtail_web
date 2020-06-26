import React from "react";
import { WithT } from "i18next";
import { useQuery } from "react-apollo";
import OwlCarousel from "react-owl-carousel";

import { GET_MY_EVENTS } from "queries";

import EventCard from "./EventCard/";

interface IMyEvents extends WithT {
  ErrorHandler: any;
  dayjs: any;
  lang: string;
  distanceMetric: string;
}

const MyEvents: React.FC<IMyEvents> = ({
  t,
  ErrorHandler,
  dayjs,
  distanceMetric,
  lang
}) => {
  const { data, loading, error } = useQuery(GET_MY_EVENTS, {
    fetchPolicy: "cache-and-network",
    returnPartialData: true
  });

  if (loading) return null;

  if (error) {
    return <ErrorHandler.report error={error} calledName={"getMyEvents"} />;
  }

  if (!data.getMyEvents || data.getMyEvents.length === 0) {
    return null;
  }

  const myEvents = data.getMyEvents;

  return (
    <div className="events-card-content my-events">
      <div className="container">
        <div className="col-md-12">
          <div className="row" id="lightgallery">
            <div className="col-md-12">
              <span className="head">{t("myevents")}</span>
            </div>
            <OwlCarousel
              nav
              autoplay
              lazyLoad
              loop={myEvents.length > 1}
              margin={30}
              navText={[
                '<i class="icon-left-open">',
                '<i class="icon-right-open">'
              ]}
              className="owl-carousel slider-content"
              autoplayTimeout={5000}
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
              {myEvents.map((event) => (
                <EventCard
                  distanceMetric={distanceMetric}
                  key={Math.random()}
                  event={event}
                  t={t}
                  dayjs={dayjs}
                  lang={lang}
                />
              ))}
            </OwlCarousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
