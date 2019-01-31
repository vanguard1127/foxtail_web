import React from 'react';
import SearchEventsFilters from './SearchEventsFilters';
import CreateEventBtn from './CreateEventBtn';
const SearchEventToolbar = ({
  location,
  setLocationValues,
  handleChangeSelect,
  maxDistance,
  ErrorHandler,
  t
}) => {
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
          />
          <CreateEventBtn t={t} ErrorHandler={ErrorHandler} />
        </div>
      </div>
    </div>
  );
};

export default SearchEventToolbar;
