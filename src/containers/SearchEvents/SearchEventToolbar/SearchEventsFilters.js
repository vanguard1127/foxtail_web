import React, { PureComponent } from "react";
import { miOptions, kiOptions } from "../../../docs/options/en";
import AddressSearch from "components/common/AddressSearch";
import Select from "components/common/Select";

class SearchEventsFilters extends PureComponent {
  render() {
    const {
      location,
      setLocationValues,
      handleChangeSelect,
      maxDistance,
      distanceMetric,
      t
    } = this.props;

    return (
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
            style={{ width: 150 }}
            setLocationValues={setLocationValues}
            address={location}
            type={"(cities)"}
            placeholder={t("srchcity") + "..."}
          />
        </div>
      </div>
    );
  }
}

export default SearchEventsFilters;
