import React, { Component } from "react";
import SearchEventsFilters from "./SearchEventsFilters";
import CreateEventBtn from "./CreateEventBtn";
class SearchEventToolbar extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.location !== nextProps.location ||
      this.props.maxDistance !== nextProps.maxDistance
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      location,
      setLocationValues,
      handleChangeSelect,
      maxDistance,
      ErrorHandler,
      t,
      distanceMetric,
      lang,
      history,
      ReactGA
    } = this.props;
    return (
      <div className="header">
        <div className="container">
          <div className="col-md-12">
            <SearchEventsFilters
              location={location}
              setLocationValues={setLocationValues}
              handleChangeSelect={handleChangeSelect}
              maxDistance={maxDistance}
              t={t}
              distanceMetric={distanceMetric}
            />
            <CreateEventBtn
              t={t}
              ErrorHandler={ErrorHandler}
              lang={lang}
              history={history}
              ReactGA={ReactGA}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SearchEventToolbar;
