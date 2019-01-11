import React from "react";
import AddressSearch from "../common/AddressSearch";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Select from "../common/Select";

const SearchEventsFilters = ({
  location,
  setLocationValues,
  handleChangeSelect,
  maxDistance,
  reset
}) => {
  return (
    <div className="settings-con">
      <Select
        onChange={handleChangeSelect}
        label="Distance Away:"
        defaultOptionValue={maxDistance.toString()}
        options={[
          { label: "5 miles", value: "5" },
          { label: "10 miles", value: "10" },
          { label: "20 miles", value: "20" },
          { label: "50 miles", value: "50" }
        ]}
        className={"dropdown"}
      />
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
