import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import OwlCarousel from "react-owl-carousel";
import $ from "jquery";
import "lightgallery";
import { GET_MY_EVENTS } from "../../queries";
import EventCard from "./EventCard";

//TODO: APPLY SHOULD RERENDER
const configLightGallery = {
  selector: "a",
  width: "100%"
};

const LIMIT = 3;

//TODO: Test paginate
class MyEvents extends PureComponent {
  fetchData = fetchMore => {
    this.setState({ loading: true });
    fetchMore({
      variables: {
        skip: this.state.skip
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.getMyEvents.docs.length === 0) {
          return previousResult;
        }

        return {
          getMyEvents: { ...fetchMoreResult.getMyEvents }
        };
      }
    });
  };

  handlePaginate = (page, fetchMore) => {
    const { ErrorHandler } = this.props;
    ErrorHandler.setBreadcrumb("Page my events");
    this.setState(
      state => ({
        skip: (page - 1) * LIMIT,
        current: page
      }),
      () => this.fetchData(fetchMore)
    );
  };

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
    const { t, ErrorHandler, dayjs } = this.props;
    return (
      <Query query={GET_MY_EVENTS} fetchPolicy="cache-and-network">
        {({ data, loading, error, fetchMore }) => {
          if (loading) return null;
          if (error) {
            return (
              <ErrorHandler.report error={error} calledName={"getMyEvents"} />
            );
          }
          if (!data.getMyEvents || data.getMyEvents.docs.length === 0) {
            return null;
          }
          const myEvents = data.getMyEvents.docs;
          return (
            <div className="events-card-content my-events">
              <div className="container">
                <div className="col-md-12">
                  <div
                    className="row"
                    id="lightgallery"
                    ref={this.onLightGallery}
                  >
                    <div className="col-md-12">
                      <span className="head">{t("myevents")}</span>
                    </div>
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
                      {myEvents.map(event => (
                        <EventCard
                          key={Math.random()}
                          event={event}
                          t={t}
                          dayjs={dayjs}
                        />
                      ))}
                    </OwlCarousel>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}
export default withRouter(MyEvents);
