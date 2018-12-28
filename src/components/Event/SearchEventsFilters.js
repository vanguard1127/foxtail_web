import React from "react";
const SearchEventsFilters = () => {
  return (
    <div className="settings-con">
      <div className="dropdown">
        <select className="js-example-basic-single" name="located[]">
          <option selected>Everwhere</option>
          <option>United States</option>
          <option>France</option>
          <option>Turkey</option>
        </select>
        <label>Events located:</label>
      </div>
      <div className="dropdown">
        <select className="js-example-basic-single" name="located[]">
          <option selected>My Location</option>
        </select>
        <label>From:</label>
      </div>
    </div>
  );
};

export default SearchEventsFilters;
