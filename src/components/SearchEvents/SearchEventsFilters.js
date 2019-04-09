import React, { PureComponent } from "react";
import { formatedMilesToKm } from "utils/distanceMetric";
import AddressSearch from "../common/AddressSearch";
import Select from "../common/Select";

class SearchEventsFilters extends PureComponent {
  handleRemoveLocLock = async () => {
    await navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        this.props.setLocationValues({ lat: latitude, long: longitude });
      },
      err => {
        alert(
          this.props.t(
            "Please enable location services to remove your set location."
          )
        );
        return;
      }
    );
  };

  getDistanceOptions() {
    const { distanceMetric, t } = this.props;
    return [5, 10, 20, 50].map(d => ({
      label: `${formatedMilesToKm(d, distanceMetric, t)}`,
      value: d
    }));
  }

  render() {
    const {
      location,
      setLocationValues,
      handleChangeSelect,
      maxDistance,
      t
    } = this.props;
    return (
      <div className="settings-con">
        <Select
          onChange={handleChangeSelect}
          label={t("disway") + ":"}
          defaultOptionValue={maxDistance.toString()}
          options={this.getDistanceOptions()}
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
            handleRemoveLocLock={this.handleRemoveLocLock}
          />
        </div>
      </div>
    );
  }
}

export default SearchEventsFilters;
