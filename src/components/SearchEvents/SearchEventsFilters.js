import React from "react";
import AddressSearch from "../common/AddressSearch";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Select from "../common/Select";

const SearchEventsFilters = ({
  location,
  setLocationValues,
  handleChangeSelect,
  maxDistance,
  reset,
  t
}) => {
  return (
    <div className="settings-con">
      <Select
        onChange={handleChangeSelect}
        label={t("Distance Away") + ":"}
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
        <label>{t("From")}:</label>
        <AddressSearch
          style={{ width: 150 }}
          setLocationValues={setLocationValues}
          address={location}
          type={"(cities)"}
          placeholder={t("Search by city...")}
        />
        <span href={null} onClick={() => reset()}>
          Reset
        </span>
      </div>
    </div>
  );
};

export default SearchEventsFilters;
