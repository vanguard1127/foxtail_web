import React from "react";
import { WithT } from "i18next";

import AddressSearch from "components/common/AddressSearch";
import Select from "components/common/Select";

import { miOptions, kiOptions } from "../../../docs/options/en";

interface ISearchEventsFilters extends WithT {
  location: any;
  setLocationValues: any;
  handleChangeSelect: (e: any) => void;
  maxDistance: number;
  distanceMetric: string;
}

const SearchEventsFilters: React.FC<ISearchEventsFilters> = ({
  location,
  setLocationValues,
  handleChangeSelect,
  maxDistance,
  distanceMetric,
  t
}) => (
  <div className="settings-con">
    <Select
      onChange={handleChangeSelect}
      label={t("disway") + ":"}
      defaultOptionValue={maxDistance.toString()}
      options={distanceMetric === "km" ? kiOptions : miOptions}
      className={"dropdown"}
    />
    <div>
      <label>{t("From")}:</label>
      <AddressSearch
        setLocationValues={setLocationValues}
        address={location}
        type={"(cities)"}
        placeholder={t("srchcity") + "..."}
      />
    </div>
  </div>
);

export default SearchEventsFilters;
