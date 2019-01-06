import React from "react";
import AddressSearch from "../common/AddressSearch";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const SearchEventsFilters = ({
  location,
  setLocationValues,
  handleChangeSelect,
  maxDistance,
  reset
}) => {
  return (
    <div className="settings-con">
      <div className="dropdown">
        <select
          className="js-example-basic-single"
          name="located[]"
          onChange={handleChangeSelect}
          value={maxDistance}
        >
          <option value={5}>&lt;5 miles</option>
          <option value={10}>&lt;10 miles</option>
          <option value={20}>&lt;20 miles</option>
          <option value={50}>&lt;50 miles</option>
        </select>
        <label>Distance:</label>
      </div>
      <div>
        <label>From:</label>
        <AddressSearch
          style={{ width: 150 }}
          setLocationValues={setLocationValues}
          address={location}
          type={"(cities)"}
        />
        <a href={null} onClick={() => reset()}>
          Reset
        </a>
      </div>
    </div>
  );
};

export default SearchEventsFilters;
