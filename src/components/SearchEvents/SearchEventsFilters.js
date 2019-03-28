import React, { PureComponent } from "react";
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
          options={[
            { label: "5" + " " + t("miles"), value: "5" },
            { label: "10" + " " + t("miles"), value: "10" },
            { label: "20" + " " + t("miles"), value: "20" },
            { label: "50" + " " + t("miles"), value: "50" }
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
            placeholder={t("srchcity") + "..."}
            handleRemoveLocLock={this.handleRemoveLocLock}
          />
        </div>
      </div>
    );
  }
}

export default SearchEventsFilters;
