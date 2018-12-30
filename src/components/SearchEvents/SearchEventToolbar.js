import React from "react";
import SearchEventsFilters from "./SearchEventsFilters";
import CreateEventBtn from "./CreateEventBtn";
const SearchEventToolbar = () => {
  return (
    <div className="header">
      <div className="container">
        <div className="col-md-12">
          <SearchEventsFilters />
          <CreateEventBtn />
        </div>
      </div>
    </div>
  );
};

export default SearchEventToolbar;
