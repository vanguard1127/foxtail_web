import React from "react";
import { WithT } from "i18next";

import SearchEventsFilters from "./SearchEventsFilters";
import CreateEventBtn from "./CreateEventBtn";

interface ISearchEventToolbar extends WithT {
  location: any;
  setLocationValues: any;
  handleChangeSelect: any;
  maxDistance: number;
  ErrorHandler: any;
  distanceMetric: string;
  lang: string;
  ReactGA: any;
  toggleScroll: any;
  dayjs: any;
}

const SearchEventToolbar: React.FC<ISearchEventToolbar> = ({
  location,
  setLocationValues,
  handleChangeSelect,
  maxDistance,
  ErrorHandler,
  t,
  distanceMetric,
  lang,
  ReactGA,
  toggleScroll,
  dayjs
}) => (
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
          ReactGA={ReactGA}
          toggleScroll={toggleScroll}
          dayjs={dayjs}
        />
      </div>
    </div>
  </div>
);

export default SearchEventToolbar;
